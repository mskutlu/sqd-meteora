import { DataHandlerContext } from "@subsquid/batch-processor"
import { Block, Instruction } from "@subsquid/solana-objects"
import { Store } from '@subsquid/typeorm-store'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { PoolService } from './pool.service'
import { SwapService } from './swap.service'
import { LiquidityService } from './liquidity.service'
import { PositionService } from './position.service'
import { RewardService } from './reward.service'
import { FeeService } from './fee.service'
import * as dlmm from '../abi/dlmm'
import * as dlmmTypes from './types'
import * as tokenProgram from '../abi/token-program'
import * as systemProgram from '../abi/system-program'
import {decodeTokenTransfersChecked, decodeSystemCreateAccounts, writeLog, decodeTokenTransfers} from "../utils"
import { DlmmFee } from "../model"

export class DlmmProcessor {
    private poolService: PoolService
    private swapService: SwapService
    private liquidityService: LiquidityService
    private positionService: PositionService
    private rewardService: RewardService
    private feeService: FeeService

    constructor(private ctx: DataHandlerContext<any, Store>) {
        const storeManager = new StoreManager(ctx)
        this.poolService = new PoolService(storeManager)
        this.swapService = new SwapService(storeManager)
        this.liquidityService = new LiquidityService(storeManager)
        this.positionService = new PositionService(storeManager)
        this.rewardService = new RewardService(storeManager)
        this.feeService = new FeeService(storeManager)
    }

    public getAllStoredBasePools() {
        return this.poolService.getAllBasePools()
    }

    public getAllStoredPools() {
        return this.poolService.getAllDlmmPools()
    }

    public getAllStoredPositions() {
        return this.positionService.getAllPositions()
    }

    public getAllStoredSwaps() {
        return this.swapService.getAllSwaps()
    }

    public getAllStoredLiquidityChanges() {
        return this.liquidityService.getAllLiquidityChanges()
    }

    public getAllStoredRewards() {
        return this.rewardService.getAllRewards()
    }

    public getAllStoredFees(): DlmmFee[] {
        return Array.from(this.feeService.feeStore.getAllValues())
    }

    async processInstruction(ins: Instruction, timestamp: number): Promise<void> {
        try {
            // Get instruction layout based on d8
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) {
                // Unrecognized DLMM instruction
                return
            }

            try {
                switch (layout.d8) {
                    case dlmm.instructions.initializeLbPair.d8:
                    case dlmm.instructions.initializePermissionLbPair.d8:
                    case dlmm.instructions.initializeCustomizablePermissionlessLbPair.d8:
                        await this.handleInitializePool(ins, timestamp)
                        break
                    case dlmm.instructions.swap.d8:
                    case dlmm.instructions.swapExactOut.d8:
                    case dlmm.instructions.swapWithPriceImpact.d8:
                        await this.handleSwap(ins, timestamp)
                        break
                    case dlmm.instructions.addLiquidity.d8:
                    case dlmm.instructions.addLiquidityByWeight.d8:
                    case dlmm.instructions.addLiquidityByStrategy.d8:
                    case dlmm.instructions.addLiquidityByStrategyOneSide.d8:
                    case dlmm.instructions.addLiquidityOneSide.d8:
                    case dlmm.instructions.addLiquidityOneSidePrecise.d8:
                        await this.handleAddLiquidity(ins, timestamp)
                        break
                    case dlmm.instructions.removeLiquidity.d8:
                    case dlmm.instructions.removeAllLiquidity.d8:
                    case dlmm.instructions.removeLiquidityByRange.d8:
                        await this.handleRemoveLiquidity(ins, timestamp)
                        break
                    case dlmm.instructions.claimReward.d8:
                        await this.handleClaimReward(ins, timestamp)
                        break
                    case dlmm.instructions.claimFee.d8:
                        await this.handleClaimFee(ins, timestamp)
                        break
                    case dlmm.instructions.togglePairStatus.d8:
                        await this.handleTogglePairStatus(ins, timestamp)
                        break
                    default:
                        // do nothing
                        break
                }
            } catch (e) {
                console.error(`Error processing DLMM instruction: ${e}`)
            }
        } catch (e) {
            console.error(`Error in DLMM processInstruction: ${e}`)
        }
    }

    private async handleInitializePool(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.InitializePoolAccounts, data: any }

            const {
                lbPair: poolAddress,
                tokenMintX,
                tokenMintY,
                reserveX,
                reserveY,
                oracle,
                funder
            } = accounts

            if (!poolAddress || !tokenMintX || !tokenMintY || !reserveX || !reserveY || !oracle || !funder) {
                return
            }

            // Look for create account instructions for reserves
            let reserveXAmount = 0n
            let reserveYAmount = 0n

            const createAccounts = decodeSystemCreateAccounts(ins)
            const transfers = decodeTokenTransfers(ins)
            const transferChecks = decodeTokenTransfersChecked(ins)
            for (const createAccount of createAccounts) {
                if (createAccount.owner === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') {
                    if (createAccount.newAccount === reserveX) {
                        reserveXAmount = createAccount.lamports
                    } else if (createAccount.newAccount === reserveY) {
                        reserveYAmount = createAccount.lamports
                    }
                }
            }

            // Create base pool with initial values
            const basePool = await this.poolService.getOrCreateBasePool(
                poolAddress,
                tokenMintX,
                tokenMintY,
                reserveX,
                reserveY,
                reserveXAmount,
                reserveYAmount,
                timestamp
            )

            // Create DLMM pool
            await this.poolService.getOrCreateDlmmPool(
                poolAddress,
                basePool,
                data.binStep,
                data.activeId
            )

            if (poolAddress === 'Es2vtGnR5afH3LQMPVeuZwFzj4HmQK4RezUVLoykom4G')
            {
                console.log({basePool: basePool, createAccounts: createAccounts, decoded: decoded, transfers: transfers, transferChecks: transferChecks})
            }
        } catch (e) {
            console.error(`Error in handleInitializePool: ${e}`)
        }
    }

    /**
     * Handle Swap
     *
     * This version uses net inflow/outflow to figure out which direction the swap is
     * (X->Y or Y->X) and updates reserves accordingly.
     */
    private async handleSwap(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.SwapAccounts, data: dlmmTypes.SwapData }

            const {
                lbPair: poolAddress,
                reserveX,
                reserveY,
                userTokenIn,
                userTokenOut,
                tokenXMint,
                tokenYMint,
                user
            } = accounts

            // Basic checks
            if (!poolAddress || !reserveX || !reserveY || !userTokenIn || !userTokenOut || !user) {
                return
            }

            // Get existing pool
            const basePool = await this.poolService.getBasePool(poolAddress)
            if (!basePool) return

            const dlmmPool = await this.poolService.getPool(poolAddress)
            if (!dlmmPool) return

            // Decode all token transfers (transferChecked)
            const transfers = decodeTokenTransfersChecked(ins)

            // Compute net inflow/outflow for X and Y
            let depositX = 0n
            let withdrawX = 0n
            let depositY = 0n
            let withdrawY = 0n

            for (const t of transfers) {
                if (t.destination === reserveX) {
                    depositX += t.amount
                }
                if (t.source === reserveX) {
                    withdrawX += t.amount
                }
                if (t.destination === reserveY) {
                    depositY += t.amount
                }
                if (t.source === reserveY) {
                    withdrawY += t.amount
                }
            }

            const netFlowX = depositX - withdrawX // + means net in, - means net out
            const netFlowY = depositY - withdrawY // + means net in, - means net out

            // figure out which token was input vs output
            let amountIn: bigint
            let amountOut: bigint
            let inputMint: string
            let outputMint: string

            // If X is negative (flow out) and Y is positive (flow in), it's X->Y
            // If Y is negative (flow out) and X is positive (flow in), it's Y->X
            if (netFlowX < 0n && netFlowY > 0n) {
                // X -> Y
                amountIn = -netFlowX // netFlowX is negative => input
                amountOut = netFlowY
                inputMint = tokenXMint
                outputMint = tokenYMint
            } else if (netFlowY < 0n && netFlowX > 0n) {
                // Y -> X
                amountIn = -netFlowY
                amountOut = netFlowX
                inputMint = tokenYMint
                outputMint = tokenXMint
            } else {
                // no valid swap pattern found
                return
            }

            // Create swap record
            await this.swapService.createSwap(
                ins.transaction?.id || '',
                dlmmPool,
                user,
                inputMint,
                outputMint,
                amountIn,
                amountOut,
                timestamp
            )

            // Update pool reserves (old + netFlow)
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                basePool.totalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleSwap: ${e}`)
        }
    }

    /**
     * Handle Add Liquidity
     * 
     * Here we interpret netFlowX and netFlowY as amounts that came in from user.
     */
    private async handleAddLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.AddLiquidityAccounts, data: dlmmTypes.AddLiquidityData }

            const {
                lbPair: poolAddress,
                reserveX,
                reserveY,
                userTokenX,
                userTokenY,
                user,
                position
            } = accounts

            if (!poolAddress || !reserveX || !reserveY || !userTokenX || !userTokenY || !user || !position) {
                return
            }

            const dlmmPool = await this.poolService.getPool(poolAddress)
            if (!dlmmPool) {
                return
            }

            // decode transfers
            const transfers = decodeTokenTransfersChecked(ins)

            // net flows
            let depositX = 0n
            let withdrawX = 0n
            let depositY = 0n
            let withdrawY = 0n

            for (const t of transfers) {
                if (t.destination === reserveX) {
                    depositX += t.amount
                }
                if (t.source === reserveX) {
                    withdrawX += t.amount
                }
                if (t.destination === reserveY) {
                    depositY += t.amount
                }
                if (t.source === reserveY) {
                    withdrawY += t.amount
                }
            }

            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // For a normal add, netFlowX >= 0, netFlowY >= 0 (the user sends tokens in)
            if (netFlowX <= 0n && netFlowY <= 0n) {
                // Possibly no real add or invalid direction
                return
            }

            // get position entity
            const dlmmPosition = await this.positionService.getPosition(position)
            if (!dlmmPosition) {
                return
            }

            // record liquidity
            await this.liquidityService.recordLiquidityChange(
                dlmmPool,
                dlmmPosition,
                'add',
                netFlowX > 0n ? netFlowX : 0n,
                netFlowY > 0n ? netFlowY : 0n,
                timestamp
            )

            // Update base pool reserves
            const basePool = await this.poolService.getBasePool(poolAddress)
            if (!basePool) return

            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                basePool.totalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleAddLiquidity: ${e}`)
        }
    }

    /**
     * Handle Remove Liquidity
     * 
     * Here we interpret netFlowX and netFlowY as amounts that went out to user if they are negative.
     */
    private async handleRemoveLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.RemoveLiquidityAccounts, data: dlmmTypes.RemoveLiquidityData }

            const {
                lbPair: poolAddress,
                reserveX,
                reserveY,
                userTokenX,
                userTokenY,
                user,
                position
            } = accounts

            if (!poolAddress || !reserveX || !reserveY || !userTokenX || !userTokenY || !user || !position) {
                return
            }

            const dlmmPool = await this.poolService.getPool(poolAddress)
            if (!dlmmPool) return

            const transfers = decodeTokenTransfersChecked(ins)

            // net flows
            let depositX = 0n
            let withdrawX = 0n
            let depositY = 0n
            let withdrawY = 0n

            for (const t of transfers) {
                if (t.destination === reserveX) {
                    depositX += t.amount
                }
                if (t.source === reserveX) {
                    withdrawX += t.amount
                }
                if (t.destination === reserveY) {
                    depositY += t.amount
                }
                if (t.source === reserveY) {
                    withdrawY += t.amount
                }
            }

            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // For a normal remove, netFlowX <= 0, netFlowY <= 0
            // meaning tokens are leaving the vault
            if (netFlowX >= 0n && netFlowY >= 0n) {
                // Possibly no real remove or invalid direction
                return
            }

            // get position entity
            const dlmmPosition = await this.positionService.getPosition(position)
            if (!dlmmPosition) {
                return
            }

            await this.liquidityService.recordLiquidityChange(
                dlmmPool,
                dlmmPosition,
                'remove',
                netFlowX < 0n ? -netFlowX : 0n,  // how much user actually received
                netFlowY < 0n ? -netFlowY : 0n,
                timestamp
            )

            // Update base pool
            const basePool = await this.poolService.getBasePool(poolAddress)
            if (!basePool) return

            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                basePool.totalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleRemoveLiquidity: ${e}`)
        }
    }

    // Below methods can remain as they are unless you also want to unify them via net-flow logic.

    private async handleInitializeReward(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.InitializeRewardAccounts, data: any }

            const { lbPair, funder } = accounts
            if (!lbPair || !funder) return

            const pool = await this.poolService.getPool(lbPair)
            if (!pool) return

            await this.rewardService.createReward(
                pool,
                data.rewardIndex,
                data.rewardDuration,
                funder,
                0n,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleInitializeReward: ${e}`)
        }
    }

    private async handleFundReward(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.FundRewardAccounts, data: any }

            const { lbPair } = accounts
            if (!lbPair) return

            const pool = await this.poolService.getPool(lbPair)
            if (!pool) return

            const reward = await this.rewardService.getReward(pool.id, data.rewardIndex)
            if (!reward) return

            await this.rewardService.updateReward(
                reward,
                reward.amount + BigInt(data.amount),
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleFundReward: ${e}`)
        }
    }

    private async handleClaimReward(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts } = decoded as { accounts: dlmmTypes.ClaimRewardAccounts }

            const {
                lbPair: poolAddress,
                position,
                user,
                rewardVault,
                userRewardToken
            } = accounts

            if (!poolAddress || !position || !user || !rewardVault || !userRewardToken) {
                return
            }

            const transfers = decodeTokenTransfersChecked(ins)

            // Look for both outgoing and incoming transfers
            const rewardOut = transfers.find(t => t.source === rewardVault)
            const rewardIn = transfers.find(t => t.destination === userRewardToken)

            if (!rewardOut || !rewardIn) {
                return
            }

            const pool = await this.poolService.getPool(poolAddress)
            if (!pool) return

            // Record reward claims
            await this.rewardService.createReward(
                pool,
                0, // rewardIndex (you may want to parse from data)
                0n, // rewardDuration
                user,
                rewardOut.amount,
                timestamp
            )

            await this.rewardService.createReward(
                pool,
                0, // rewardIndex
                0n, // rewardDuration
                user,
                rewardIn.amount,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleClaimReward: ${e}`)
        }
    }

    private async handleClaimFee(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode(ins) as unknown
            const { accounts } = decoded as { accounts: dlmmTypes.ClaimFeeAccounts }

            const {
                lbPair: poolAddress,
                position,
                user,
                reserveX,
                reserveY,
                feeOwner,
                userTokenX,
                userTokenY
            } = accounts

            if (!poolAddress || !position || !user || !reserveX || !reserveY || !feeOwner || !userTokenX || !userTokenY) {
                return
            }

            const pool = await this.poolService.getPool(poolAddress)
            if (!pool) return

            const transfers = decodeTokenTransfersChecked(ins)

            // Outgoing from reserves
            const xOut = transfers.find(t => t.source === reserveX)
            const yOut = transfers.find(t => t.source === reserveY)

            // Incoming to user
            const xIn = transfers.find(t => t.destination === userTokenX)
            const yIn = transfers.find(t => t.destination === userTokenY)

            // Record fee claims
            if (xOut) {
                await this.feeService.createFeeClaim(
                    ins.transaction?.id || '',
                    pool,
                    position,
                    user,
                    xOut.amount,
                    0n,
                    timestamp,
                    'out'
                )
            }
            if (yOut) {
                await this.feeService.createFeeClaim(
                    ins.transaction?.id || '',
                    pool,
                    position,
                    user,
                    0n,
                    yOut.amount,
                    timestamp,
                    'out'
                )
            }
            if (xIn) {
                await this.feeService.createFeeClaim(
                    ins.transaction?.id || '',
                    pool,
                    position,
                    user,
                    xIn.amount,
                    0n,
                    timestamp,
                    'in'
                )
            }
            if (yIn) {
                await this.feeService.createFeeClaim(
                    ins.transaction?.id || '',
                    pool,
                    position,
                    user,
                    0n,
                    yIn.amount,
                    timestamp,
                    'in'
                )
            }
        } catch (e) {
            console.error(`Error in handleClaimFee: ${e}`)
        }
    }

    private async handleTogglePairStatus(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const lbPair = ins.accounts[0]
            const basePool = await this.poolService.getBasePool(lbPair)
            if (!basePool) return

            await this.poolService.updateBasePool(
                basePool,
                basePool.reserveX,
                basePool.reserveY,
                basePool.totalLiquidity,
                !basePool.status,
                timestamp
            )
        } catch (e) {
            console.error(`Error in handleTogglePairStatus: ${e}`)
        }
    }
}
