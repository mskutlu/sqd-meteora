import { DataHandlerContext } from "@subsquid/batch-processor"
import { Block, Instruction } from "@subsquid/solana-objects"
import { Store } from '@subsquid/typeorm-store'
import { StoreManager } from '../store/memory.store'
import { PoolService } from './pool.service'
import { SwapService } from './swap.service'
import { LiquidityService } from './liquidity.service'
import { FeeService } from './fee.service'
import { LockService } from './lock.service'
import * as damm from '../abi/damm'
import * as dammTypes from './types'
import * as tokenProgram from '../abi/token-program'
import { decodeTokenTransfers } from "../utils"

export class DammProcessor {
    private poolService: PoolService
    private swapService: SwapService
    private liquidityService: LiquidityService
    private feeService: FeeService
    private lockService: LockService

    constructor(private ctx: DataHandlerContext<any, Store>) {
        const storeManager = new StoreManager(ctx)
        this.poolService = new PoolService(storeManager)
        this.swapService = new SwapService(storeManager)
        this.liquidityService = new LiquidityService(storeManager)
        this.feeService = new FeeService(storeManager)
        this.lockService = new LockService(storeManager)
    }

    public getAllStoredBasePools() {
        return this.poolService.getAllBasePools()
    }

    public getAllStoredPools() {
        return this.poolService.getAllDammPools()
    }

    public getAllStoredPositions() {
        return this.liquidityService.getAllPositions()
    }

    public getAllStoredSwaps() {
        return this.swapService.getAllSwaps()
    }

    public getAllStoredLiquidityChanges() {
        return this.liquidityService.getAllLiquidityChanges()
    }

    public getAllStoredFees() {
        return this.feeService.getAllFees()
    }

    public getAllStoredLocks() {
        return this.lockService.getAllLocks()
    }

    async processInstruction(ins: Instruction, timestamp: number): Promise<void> {
        try {
            // Identify which instruction layout we have
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) {
                // Unknown instruction
                return
            }

            try {
                switch (layout.d8) {
                    case damm.instructions.initializePermissionedPool.d8:
                    case damm.instructions.initializePermissionlessPool.d8:
                    case damm.instructions.initializePermissionlessPoolWithFeeTier.d8:
                    case damm.instructions.initializePermissionlessConstantProductPoolWithConfig.d8:
                    case damm.instructions.initializePermissionlessConstantProductPoolWithConfig2.d8:
                    case damm.instructions.initializeCustomizablePermissionlessConstantProductPool.d8:
                        await this.handleInitializePool(ins, timestamp)
                        break
                    case damm.instructions.swap.d8:
                        await this.handleSwap(ins, timestamp)
                        break
                    case damm.instructions.addBalanceLiquidity.d8:
                        await this.handleAddBalanceLiquidity(ins, timestamp)
                        break
                    case damm.instructions.removeBalanceLiquidity.d8:
                        await this.handleRemoveBalanceLiquidity(ins, timestamp)
                        break
                    case damm.instructions.addImbalanceLiquidity.d8:
                        await this.handleAddImbalanceLiquidity(ins, timestamp)
                        break
                    case damm.instructions.removeLiquiditySingleSide.d8:
                        await this.handleRemoveLiquiditySingleSide(ins, timestamp)
                        break
                    case damm.instructions.bootstrapLiquidity.d8:
                        await this.handleBootstrapLiquidity(ins, timestamp)
                        break
                    case damm.instructions.enableOrDisablePool.d8:
                        await this.handleEnableOrDisablePool(ins, timestamp)
                        break
                    case damm.instructions.overrideCurveParam.d8:
                        await this.handleOverrideCurveParam(ins, timestamp)
                        break
                    case damm.instructions.claimFee.d8:
                        await this.handleClaimFee(ins, timestamp)
                        break
                    default:
                        // do nothing
                        break
                }
            } catch (decodeError) {
                // If decoding fails for some reason, skip
                return
            }
        } catch (error) {
            console.error(`Error processing instruction ${ins.d8}:`, error)
            throw error
        }
    }

    //--------------------------------------------------------------------------
    // 1) INITIALIZE POOL
    //--------------------------------------------------------------------------
    private async handleInitializePool(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as unknown as {
                accounts: dammTypes.InitializePoolAccounts,
                data: dammTypes.InitializePoolData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                tokenAMint,
                tokenBMint,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            } = accounts

            if (!poolAddress || !lpMint || !aTokenVault || !bTokenVault || !aVaultLpMint || !bVaultLpMint) {
                return
            }

            // Create base pool with initial amounts (often 0)
            await this.poolService.getOrCreateBasePool(
                poolAddress,
                tokenAMint,
                tokenBMint,
                aTokenVault,
                bTokenVault,
                data.tokenAAmount,
                data.tokenBAmount,
                timestamp
            )
        } catch (e) {
            console.error('Error processing initialize pool:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 2) SWAP
    //--------------------------------------------------------------------------
    private async handleSwap(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.SwapAccounts,
                data: dammTypes.SwapData
            }

            const { accounts } = decoded
            const { pool: poolAddress, user, aVault, bVault, lpMint } = accounts

            if (!poolAddress || !user) {
                return
            }

            // 1) Find base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) Possibly create DAMM pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint || '',
                aVault,
                bVault,
                accounts.aVaultLpMint,
                accounts.bVaultLpMint
            )

            // 3) Decode token transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) Compute net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) {
                    depositX += t.amount
                }
                if (t.source === basePool.tokenXVault) {
                    withdrawX += t.amount
                }
                if (t.destination === basePool.tokenYVault) {
                    depositY += t.amount
                }
                if (t.source === basePool.tokenYVault) {
                    withdrawY += t.amount
                }
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // 5) Figure out direction & amounts
            let amountIn = 0n
            let amountOut = 0n
            let inMint = ''
            let outMint = ''

            // X→Y: netFlowX > 0, netFlowY < 0
            if (netFlowX > 0n && netFlowY < 0n) {
                amountIn = netFlowX
                amountOut = -netFlowY
                inMint = basePool.tokenX
                outMint = basePool.tokenY
            }
            // Y→X: netFlowY > 0, netFlowX < 0
            else if (netFlowY > 0n && netFlowX < 0n) {
                amountIn = netFlowY
                amountOut = -netFlowX
                inMint = basePool.tokenY
                outMint = basePool.tokenX
            } else {
                // Not a valid swap pattern
                return
            }

            // 6) Create swap record
            await this.swapService.createSwap(
                ins.transaction?.id || '',
                dammPool,
                user,
                inMint,
                outMint,
                amountIn,
                amountOut,
                timestamp
            )

            // 7) Update base pool reserves
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
            console.error('Error processing swap:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 3) ADD BALANCE LIQUIDITY
    //--------------------------------------------------------------------------
    private async handleAddBalanceLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.AddBalanceLiquidityAccounts,
                data: dammTypes.AddBalanceLiquidityData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                user,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            } = accounts

            if (!poolAddress || !lpMint || !aTokenVault || !bTokenVault || !user) {
                return
            }

            // 1) Get base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) Get/create DAMM pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            )

            // 3) Decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) net flow for X and Y
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // We expect netFlowX >= 0 && netFlowY >= 0 for a balanced add
            if (netFlowX <= 0n || netFlowY <= 0n) {
                // Possibly invalid or no deposit
                return
            }

            // 5) Create or get the user's position
            const position = await this.liquidityService.getOrCreatePosition(dammPool, user, timestamp)

            // 6) Record liquidity change
            await this.liquidityService.recordLiquidityChange(
                dammPool,
                position,
                'add',
                netFlowX,
                netFlowY,
                0n,
                timestamp
            )

            // 7) Update position's LP amount
            await this.liquidityService.updatePosition(
                position,
                data.poolTokenAmount, // how many LP tokens minted
                timestamp
            )

            // 8) Update base pool
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY
            const newTotalLiquidity = BigInt(basePool.totalLiquidity) + BigInt(data.poolTokenAmount)

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                newTotalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error('Error processing add balance liquidity:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 4) REMOVE BALANCE LIQUIDITY
    //--------------------------------------------------------------------------
    private async handleRemoveBalanceLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.RemoveBalanceLiquidityAccounts,
                data: dammTypes.RemoveBalanceLiquidityData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                user,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            } = accounts

            if (!poolAddress || !lpMint || !aTokenVault || !bTokenVault || !user) {
                return
            }

            // 1) Get base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) Get/create DAMM pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            )

            // 3) Decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // For remove liquidity, we typically expect netFlowX <= 0 and netFlowY <= 0
            if (netFlowX >= 0n || netFlowY >= 0n) {
                // Possibly invalid or no removal
                return
            }

            // 5) Get user's position
            const position = await this.liquidityService.getOrCreatePosition(dammPool, user, timestamp)

            // 6) Record liquidity change
            await this.liquidityService.recordLiquidityChange(
                dammPool,
                position,
                'remove',
                -netFlowX,  // how many tokens user got from X vault
                -netFlowY,  // how many tokens user got from Y vault
                0n,
                timestamp
            )

            // 7) Update position's LP token
            await this.liquidityService.updatePosition(
                position,
                -data.poolTokenAmount,
                timestamp
            )

            // 8) Update base pool
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY
            const newTotalLiquidity = BigInt(basePool.totalLiquidity) - BigInt(data.poolTokenAmount)

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                newTotalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error('Error processing remove balance liquidity:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 5) ADD IMBALANCE LIQUIDITY
    //--------------------------------------------------------------------------
    private async handleAddImbalanceLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.AddImbalanceLiquidityAccounts,
                data: dammTypes.AddImbalanceLiquidityData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                user,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint,
                userAToken,
                userBToken
            } = accounts

            if (!poolAddress || !lpMint || !user || !aTokenVault || !bTokenVault) {
                return
            }

            // 1) base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) damm pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            )

            // 3) decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // 5) Position
            const position = await this.liquidityService.getOrCreatePosition(dammPool, user, timestamp)

            // 6) record liquidity change
            // Typically for "add imbalance," netFlowX and netFlowY might not both be > 0,
            // but user is adding more of one side than the other.
            await this.liquidityService.recordLiquidityChange(
                dammPool,
                position,
                'add',
                netFlowX > 0n ? netFlowX : 0n,
                netFlowY > 0n ? netFlowY : 0n,
                0n,
                timestamp
            )

            // 7) update position (LP tokens minted)
            await this.liquidityService.updatePosition(
                position,
                data.minimumPoolTokenAmount,
                timestamp
            )

            // 8) update base pool
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY
            const newTotalLiquidity = BigInt(basePool.totalLiquidity) + BigInt(data.minimumPoolTokenAmount)

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                newTotalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error('Error processing add imbalance liquidity:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 6) REMOVE LIQUIDITY SINGLE SIDE
    //--------------------------------------------------------------------------
    private async handleRemoveLiquiditySingleSide(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.RemoveLiquiditySingleSideAccounts,
                data: dammTypes.RemoveLiquiditySingleSideData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                user,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            } = accounts

            if (!poolAddress || !lpMint || !aTokenVault || !bTokenVault || !user) {
                return
            }

            // 1) base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) damm pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aTokenVault,
                bTokenVault,
                aVaultLpMint,
                bVaultLpMint
            )

            // 3) decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // Single-side remove => typically one of netFlowX or netFlowY is <0, the other ~0
            // But let's proceed:
            const position = await this.liquidityService.getOrCreatePosition(dammPool, user, timestamp)

            // Record liquidity change
            // If X is the one going out, netFlowX < 0 => user withdrew that side
            // If Y is the one going out, netFlowY < 0
            await this.liquidityService.recordLiquidityChange(
                dammPool,
                position,
                'singleSide',
                netFlowX < 0n ? -netFlowX : 0n,
                netFlowY < 0n ? -netFlowY : 0n,
                0n,
                timestamp
            )

            // update position's LP tokens
            await this.liquidityService.updatePosition(
                position,
                -data.poolTokenAmount,
                timestamp
            )

            // Update base pool reserves
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY
            const newTotalLiquidity = BigInt(basePool.totalLiquidity) - BigInt(data.poolTokenAmount)

            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                newTotalLiquidity,
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error('Error processing remove liquidity single side:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 7) BOOTSTRAP LIQUIDITY
    //--------------------------------------------------------------------------
    private async handleBootstrapLiquidity(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as unknown as {
                accounts: dammTypes.BootstrapLiquidityAccounts,
                data: dammTypes.BootstrapLiquidityData
            }

            const { accounts, data } = decoded
            const {
                pool: poolAddress,
                lpMint,
                aTokenVault,
                bTokenVault,
                aVault,
                bVault,
                aVaultLpMint,
                bVaultLpMint,
                user
            } = accounts

            if (!poolAddress || !lpMint || !aTokenVault || !bTokenVault || !aVault || !bVault || !user) {
                return
            }

            // 1) base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) For bootstrap, pool reserves should be 0
            if (basePool.reserveX !== 0n || basePool.reserveY !== 0n) {
                return
            }

            // 3) damm pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aVault,
                bVault,
                aVaultLpMint,
                bVaultLpMint
            )

            // 4) decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 5) net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // 6) create position
            const position = await this.liquidityService.getOrCreatePosition(dammPool, user, timestamp)

            // 7) record liquidity
            await this.liquidityService.recordLiquidityChange(
                dammPool,
                position,
                'bootstrap',
                netFlowX > 0n ? netFlowX : 0n,
                netFlowY > 0n ? netFlowY : 0n,
                0n,
                timestamp
            )

            // 8) update pool
            // Usually after bootstrap, totalLiquidity can still be 0 (depending on the logic).
            const newReserveX = BigInt(basePool.reserveX) + netFlowX
            const newReserveY = BigInt(basePool.reserveY) + netFlowY
            await this.poolService.updateBasePool(
                basePool,
                newReserveX,
                newReserveY,
                0n, // still 0 or however you define "initial liquidity"
                basePool.status,
                timestamp
            )
        } catch (e) {
            console.error('Error processing bootstrap liquidity:', e)
            throw e
        }
    }

    //--------------------------------------------------------------------------
    // 8) ENABLE OR DISABLE POOL
    //--------------------------------------------------------------------------
    private async handleEnableOrDisablePool(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.EnableOrDisablePoolAccounts,
                data: dammTypes.EnableOrDisablePoolData
            }

            const { accounts, data } = decoded
            const { pool: poolAddress } = accounts
            if (!poolAddress) return

            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            await this.poolService.updateBasePool(
                basePool,
                basePool.reserveX,
                basePool.reserveY,
                basePool.totalLiquidity,
                data.enable, // true or false
                timestamp
            )
        } catch (error) {
            console.error('Error in handleEnableOrDisablePool:', error)
            throw error
        }
    }

    //--------------------------------------------------------------------------
    // 9) OVERRIDE CURVE PARAM
    //--------------------------------------------------------------------------
    private async handleOverrideCurveParam(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as {
                accounts: dammTypes.OverrideCurveParamAccounts,
                data: dammTypes.OverrideCurveParamData
            }

            const { accounts, data } = decoded
            const { pool: poolAddress } = accounts
            if (!poolAddress) return

            const pool = await this.poolService.find(poolAddress)
            if (!pool) return

            // If you want to store the new curve param, do so in your DB
            // For now, just update the timestamp or something minimal
            await this.poolService.updateBasePool(
                pool,
                pool.reserveX,
                pool.reserveY,
                pool.totalLiquidity,
                pool.status,
                timestamp
            )
        } catch (error) {
            console.error('Error in handleOverrideCurveParam:', error)
            throw error
        }
    }

    //--------------------------------------------------------------------------
    // 10) CLAIM FEE
    //--------------------------------------------------------------------------
    private async handleClaimFee(ins: Instruction, timestamp: number): Promise<void> {
        try {
            const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
            if (!layout) return

            const decoded = layout.decode({
                data: ins.data,
                accounts: ins.accounts
            }) as unknown as {
                accounts: dammTypes.ClaimFeeAccounts,
                data: dammTypes.ClaimFeeData
            }

            const { accounts } = decoded
            const {
                pool: poolAddress,
                lpMint,
                lockEscrow,
                owner,
                sourceTokens,
                escrowVault,
                aTokenVault,
                bTokenVault,
                aVault,
                bVault,
                aVaultLp,
                bVaultLp,
                userAToken,
                userBToken
            } = accounts

            if (!poolAddress || !lpMint || !owner || !aTokenVault || !bTokenVault) {
                return
            }

            // 1) base pool
            const basePool = await this.poolService.find(poolAddress)
            if (!basePool) return

            // 2) damm pool
            const dammPool = await this.poolService.getOrCreateDammPool(
                poolAddress,
                basePool,
                lpMint,
                aVault,
                bVault,
                aVaultLp,
                bVaultLp
            )

            // 3) decode transfers
            const transfers = decodeTokenTransfers(ins)

            // 4) find net flow
            let depositX = 0n, withdrawX = 0n
            let depositY = 0n, withdrawY = 0n
            for (const t of transfers) {
                if (t.destination === basePool.tokenXVault) depositX += t.amount
                if (t.source === basePool.tokenXVault)     withdrawX += t.amount
                if (t.destination === basePool.tokenYVault) depositY += t.amount
                if (t.source === basePool.tokenYVault)     withdrawY += t.amount
            }
            const netFlowX = depositX - withdrawX
            const netFlowY = depositY - withdrawY

            // 5) If user is claiming fees, presumably X or Y tokens flow out from vault to user
            const feeX = withdrawX > 0n ? withdrawX : 0n
            const feeY = withdrawY > 0n ? withdrawY : 0n

            // Create fee record if some fees were actually claimed
            if (feeX > 0n || feeY > 0n) {
                await this.feeService.createFee(
                    ins.transaction?.id || '',
                    dammPool,
                    owner,
                    feeX,
                    feeY,
                    timestamp
                )
            }

            // 6) Update base pool: new reserves
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
            console.error('Error processing claim fee:', e)
            throw e
        }
    }
}
