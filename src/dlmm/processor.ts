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
            if (!layout) {
                console.error(`Error in handleInitializePool: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

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

            // Check for missing required parameters and log specific errors
            const missingParams = [
                ['pool address', poolAddress],
                ['token mint X', tokenMintX],
                ['token mint Y', tokenMintY],
                ['reserve X', reserveX],
                ['reserve Y', reserveY],
                ['oracle', oracle],
                ['funder', funder]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleInitializePool: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            // Look for create account instructions for reserves
            let reserveXAmount = 0n
            let reserveYAmount = 0n

            const createAccounts = decodeSystemCreateAccounts(ins)
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
            if (!layout) {
                console.error(`Error in handleSwap: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts } = decoded as { accounts: dlmmTypes.SwapAccounts, data: dlmmTypes.SwapData }

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

            // Check for missing required parameters
            const missingParams = [
                ['pool address', poolAddress],
                ['reserve X', reserveX],
                ['reserve Y', reserveY],
                ['user token in', userTokenIn],
                ['user token out', userTokenOut],
                ['user', user]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleSwap: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            // Get existing pool
            const basePool = await this.poolService.getOrCreateBasePool(
                poolAddress,
                reserveX,
                reserveY,
                tokenXMint,
                tokenYMint,
                0n,
                0n,
                timestamp
            )

            const dlmmPool = await this.poolService.getOrCreateDlmmPool(
                poolAddress,
                basePool,
                0,
                0
            )

            // Decode all token transfers (transferChecked)
            const transfers = decodeTokenTransfersChecked(ins)

            // Compute net inflow/outflow for X and Y
            let depositX = 0n
            let withdrawX = 0n
            let depositY = 0n
            let withdrawY = 0n
            let isXtoY = false;
            for (const t of transfers) {
                if (t.destination === reserveX) {
                    depositX += t.amount
                    isXtoY = true;
                }
                if (t.source === reserveX) {
                    withdrawX += t.amount
                    isXtoY = false;
                }
                if (t.destination === reserveY) {
                    depositY += t.amount
                    isXtoY = false;
                }
                if (t.source === reserveY) {
                    withdrawY += t.amount
                    isXtoY = true;
                }
            }

            const netFlowX = depositX - withdrawX // + means net in, - means net out
            const netFlowY = depositY - withdrawY // + means net in, - means net out

            // figure out which token was input vs output
            let amountIn: bigint
            let amountOut: bigint
            let inputMint: string
            let outputMint: string

            if (isXtoY) {
                // X -> Y
                amountIn = -netFlowX
                amountOut = netFlowY
                inputMint = tokenXMint
                outputMint = tokenYMint
            } else  {
                // Y -> X
                amountIn = -netFlowY
                amountOut = netFlowX
                inputMint = tokenYMint
                outputMint = tokenXMint
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
            if (!layout) {
                console.error(`Error in handleAddLiquidity: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.AddLiquidityAccounts, data: dlmmTypes.AddLiquidityData }

            const {
                lbPair: poolAddress,
                reserveX,
                reserveY,
                userTokenX,
                userTokenY,
                position
            } = accounts

            const missingParams = [
                ['pool address', poolAddress],
                ['reserve X', reserveX],
                ['reserve Y', reserveY],
                ['user token X', userTokenX],
                ['user token Y', userTokenY],
                ['position', position]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleAddLiquidity: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            const dlmmPool = await this.poolService.getPool(poolAddress)
            if (!dlmmPool) {
                console.error(`Error in handleAddLiquidity: Could not find DLMM pool for address: ${poolAddress}`)
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
                console.error(`Error in handleAddLiquidity: Could not find position: ${position}`)
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
            if (!layout) {
                console.error(`Error in handleRemoveLiquidity: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.RemoveLiquidityAccounts, data: dlmmTypes.RemoveLiquidityData }

            const {
                lbPair: poolAddress,
                reserveX,
                reserveY,
                userTokenX,
                userTokenY,
                position
            } = accounts

            const missingParams = [
                ['pool address', poolAddress],
                ['reserve X', reserveX],
                ['reserve Y', reserveY],
                ['user token X', userTokenX],
                ['user token Y', userTokenY],
                ['position', position]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleRemoveLiquidity: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            const dlmmPool = await this.poolService.getPool(poolAddress)
            if (!dlmmPool) {
                console.error(`Error in handleRemoveLiquidity: Could not find DLMM pool for address: ${poolAddress}`)
                return
            }

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
                console.error(`Error in handleRemoveLiquidity: Could not find position: ${position}`)
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
            if (!layout) {
                console.error(`Error in handleInitializeReward: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.InitializeRewardAccounts, data: any }

            const { lbPair, funder } = accounts
            const missingParams = [
                ['lb pair', lbPair],
                ['funder', funder]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleInitializeReward: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            const pool = await this.poolService.getPool(lbPair)
            if (!pool) {
                console.error(`Error in handleInitializeReward: Could not find DLMM pool for address: ${lbPair}`)
                return
            }

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
            if (!layout) {
                console.error(`Error in handleFundReward: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts, data } = decoded as { accounts: dlmmTypes.FundRewardAccounts, data: any }

            const { lbPair } = accounts
            if (!lbPair) {
                console.error('Error in handleFundReward: Missing required parameter: lb pair')
                return
            }

            const pool = await this.poolService.getPool(lbPair)
            if (!pool) return

            const reward = await this.rewardService.getReward(pool.id, data.rewardIndex)
            if (!reward) {
                console.error(`Error in handleFundReward: Could not find reward for pool ${pool.id} with index ${data.rewardIndex}`)
                return
            }

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
            if (!layout) {
                console.error(`Error in handleClaimReward: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts } = decoded as { accounts: dlmmTypes.ClaimRewardAccounts }

            const {
                lbPair: poolAddress,
                position,
                sender,
                rewardVault,
            } = accounts

            const missingParams = [
                ['pool address', poolAddress],
                ['position', position],
                ['sender', sender],
                ['reward vault', rewardVault],
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleClaimReward: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            const transfers = decodeTokenTransfersChecked(ins)

            // Look for both outgoing and incoming transfers
            const rewardOut = transfers.find(t => t.source === rewardVault)
            const rewardIn = transfers.find(t => t.destination === sender)

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
                sender,
                rewardOut.amount,
                timestamp
            )

            await this.rewardService.createReward(
                pool,
                0, // rewardIndex
                0n, // rewardDuration
                sender,
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
            if (!layout) {
                console.error(`Error in handleClaimFee: Could not find instruction layout for d8: ${ins.d8}`)
                return
            }

            const decoded = layout.decode(ins) as unknown
            const { accounts } = decoded as { accounts: dlmmTypes.ClaimFeeAccounts }

            const {
                lbPair: poolAddress,
                position,
                reserveX,
                reserveY,
                userTokenX,
                userTokenY,
                sender
            } = accounts

            const missingParams = [
                ['pool address', poolAddress],
                ['position', position],
                ['reserve X', reserveX],
                ['reserve Y', reserveY],
                ['user token X', userTokenX],
                ['user token Y', userTokenY],
                ['sender', sender]
            ].filter(([name, value]) => !value)
             .map(([name]) => name)

            if (missingParams.length > 0) {
                console.error(`Error in handleClaimFee: Missing required parameters: ${missingParams.join(', ')}`)
                return
            }

            const pool = await this.poolService.getPool(poolAddress)
            if (!pool) {
                console.error(`Error in handleClaimFee: Could not find DLMM pool for address: ${poolAddress}`)
                return
            }

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
                    sender,
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
                    sender,
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
                    sender,
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
                    sender,
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
            if (!lbPair) {
                console.error('Error in handleTogglePairStatus: Missing required parameter: lb pair')
                return
            }
            
            const basePool = await this.poolService.getBasePool(lbPair)
            if (!basePool) {
                console.error(`Error in handleTogglePairStatus: Could not find base pool for lb pair: ${lbPair}`)
                return
            }

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
