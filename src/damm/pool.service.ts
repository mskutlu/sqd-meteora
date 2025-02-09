import { BasePool, DAMMPool } from '../model'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createPoolId } from '../utils'

export class PoolService {
    private basePoolStore: MemoryStore<BasePool>
    private dammPoolStore: MemoryStore<DAMMPool>

    constructor(private storeManager: StoreManager) {
        this.basePoolStore = storeManager.getStore<BasePool>('basePool')
        this.dammPoolStore = storeManager.getStore<DAMMPool>('dammPool')
    }

    public async find(id: string): Promise<BasePool | undefined> {
        // First check memory
        const memoryPool = await this.basePoolStore.find(id)
        if (memoryPool) {
            return memoryPool
        }

        // If not in memory, check database
        const dbPool = await this.storeManager.ctx.store.findOneBy(BasePool, {id})
        if (dbPool) {
            // Cache in memory for future use
            await this.basePoolStore.save(dbPool)
            return dbPool
        }

        return undefined
    }

    public async findDammPool(id: string): Promise<DAMMPool | undefined> {
        // First check memory
        const memoryPool = await this.dammPoolStore.find(id)
        if (memoryPool) {
            return memoryPool
        }

        // If not in memory, check database
        const dbPool = await this.storeManager.ctx.store.findOneBy(DAMMPool, {id})
        if (dbPool) {
            // Cache in memory for future use
            await this.dammPoolStore.save(dbPool)
            return dbPool
        }

        return undefined
    }

    public async getOrCreateBasePool(
        poolId: string,
        tokenX: string,
        tokenY: string,
        tokenXVault: string,
        tokenYVault: string,
        reserveX: bigint,
        reserveY: bigint,
        timestamp: number
    ): Promise<BasePool> {
        const existingPool = await this.find(poolId)
        if (existingPool) {
            return existingPool
        }

        const currentDate = new Date(timestamp * 1000)
        const basePool = new BasePool({
            id: poolId,
            tokenX,
            tokenY,
            tokenXVault,
            tokenYVault,
            reserveX,
            reserveY,
            totalLiquidity: 0n,
            status: true,
            createdAt: currentDate,
            updatedAt: currentDate
        })

        await this.basePoolStore.save(basePool)
        return basePool
    }

    public async getOrCreateDammPool(
        poolAddress: string,
        basePool: BasePool,
        lpMint: string,
        aVault: string,
        bVault: string,
        aVaultLpMint: string,
        bVaultLpMint: string
    ): Promise<DAMMPool> {
        const poolId = createPoolId(poolAddress)
        const existingPool = await this.findDammPool(poolId)
        if (existingPool) {
            return existingPool
        }

        const pool = new DAMMPool({
            id: poolId,
            lpMint,
            aVault,
            bVault,
            aVaultLpMint,
            bVaultLpMint,
            curveType: '0',
            basePool
        })

        await this.dammPoolStore.save(pool)
        return pool
    }

    public async updateBasePool(
        basePool: BasePool,
        reserveX: bigint,
        reserveY: bigint,
        totalLiquidity: bigint,
        status: boolean,
        timestamp: number
    ): Promise<void> {
        
        basePool.reserveX = reserveX
        basePool.reserveY = reserveY
        basePool.totalLiquidity = totalLiquidity
        basePool.updatedAt = new Date(timestamp * 1000)
        basePool.status = status
        await this.basePoolStore.update(basePool)
    }

    public getAllBasePools(): BasePool[] {
        return this.basePoolStore.getAll()
    }

    public getAllDammPools(): DAMMPool[] {
        return this.dammPoolStore.getAll()
    }
}
