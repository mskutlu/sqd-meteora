import { BasePool, DLMMPool } from '../model/generated'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createPoolId } from '../utils'

export class PoolService {
    private basePoolStore: MemoryStore<BasePool>
    private dlmmPoolStore: MemoryStore<DLMMPool>

    constructor(private storeManager: StoreManager) {
        this.basePoolStore = storeManager.getStore<BasePool>('BasePool')
        this.dlmmPoolStore = storeManager.getStore<DLMMPool>('DLMMPool')
    }

    public async getOrCreateBasePool(
        poolId: string,
        tokenX: string,
        tokenY: string,
        reserveX: string,
        reserveY: string,
        reserveXAmount: bigint,
        reserveYAmount: bigint,
        timestamp: number
    ): Promise<BasePool> {
        const existingPool = await this.basePoolStore.find(poolId)
        if (existingPool) {
            return existingPool
        }

        const currentDate = new Date(timestamp * 1000)
        const basePool = new BasePool({
            id: poolId,
            tokenX,
            tokenY,
            tokenXVault:reserveX,
            tokenYVault:reserveY,
            reserveX:reserveXAmount,
            reserveY:reserveYAmount,
            totalLiquidity: 0n,
            status: true,
            createdAt: currentDate,
            updatedAt: currentDate
        })

        await this.basePoolStore.save(basePool)
        return basePool
    }

    public async getOrCreateDlmmPool(
        poolAddress: string,
        basePool: BasePool,
        binStep: number,
        activeId: number,
        activationPoint?: bigint,
        preActivationDuration?: bigint,
        preActivationSwapAddress?: string
    ): Promise<DLMMPool> {
        const poolId = createPoolId(poolAddress)
        const existingPool = await this.dlmmPoolStore.find(poolId)
        if (existingPool) {
            return existingPool
        }

        const pool = new DLMMPool()
        pool.id = poolId
        pool.basePool = basePool
        pool.binStep = binStep
        pool.activeId = activeId
        pool.activationPoint = activationPoint
        pool.preActivationDuration = preActivationDuration
        pool.preActivationSwapAddress = preActivationSwapAddress

        await this.dlmmPoolStore.save(pool)
        return pool
    }

    public async updateBasePool(
        basePool: BasePool,
        reserveXAmount: bigint,
        reserveYAmount: bigint,
        totalLiquidity: bigint,
        status: boolean,
        timestamp: number
    ): Promise<void> {
        basePool.reserveX = reserveXAmount
        basePool.reserveY = reserveYAmount
        basePool.totalLiquidity = totalLiquidity
        basePool.updatedAt = new Date(timestamp * 1000)
        basePool.status = status
        await this.basePoolStore.update(basePool)
    }

    public async updateDlmmPool(
        pool: DLMMPool,
        activeId: number,
        activationPoint?: bigint,
        preActivationDuration?: bigint,
        preActivationSwapAddress?: string
    ): Promise<void> {
        pool.activeId = activeId
        if (activationPoint !== undefined) pool.activationPoint = activationPoint
        if (preActivationDuration !== undefined) pool.preActivationDuration = preActivationDuration
        if (preActivationSwapAddress !== undefined) pool.preActivationSwapAddress = preActivationSwapAddress
        await this.dlmmPoolStore.update(pool)
    }

    public async getBasePool(poolId: string): Promise<BasePool | undefined> {
        return this.basePoolStore.find(poolId)
    }

    public async getPool(poolId: string): Promise<DLMMPool | undefined> {
        return this.dlmmPoolStore.find(poolId)
    }

    public getAllBasePools(): BasePool[] {
        return this.basePoolStore.getAll()
    }

    public getAllDlmmPools(): DLMMPool[] {
        return this.dlmmPoolStore.getAll()
    }
}
