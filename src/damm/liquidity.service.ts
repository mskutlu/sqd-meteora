import { DAMMPool, DAMMLiquidityPosition, DAMMLiquidityChange } from '../model'
import { MemoryStore, StoreManager } from '../store/memory.store'

export class LiquidityService {
    private positionStore: MemoryStore<DAMMLiquidityPosition>
    private liquidityChangeStore: MemoryStore<DAMMLiquidityChange>

    constructor(private storeManager: StoreManager) {
        this.positionStore = storeManager.getStore<DAMMLiquidityPosition>('DAMMLiquidityPosition')
        this.liquidityChangeStore = storeManager.getStore<DAMMLiquidityChange>('DAMMLiquidityChange')
    }

    public async getOrCreatePosition(
        pool: DAMMPool,
        owner: string,
        timestamp: number
    ): Promise<DAMMLiquidityPosition> {
        const id = `${pool.id}-${owner}`
        const existingPosition = await this.positionStore.find(id)
        if (existingPosition) {
            return existingPosition
        }

        const currentDate = new Date(timestamp * 1000)
        const position = new DAMMLiquidityPosition({
            id,
            pool,
            owner,
            lpTokenAmount: 0n,
            createdAt: currentDate,
            updatedAt: currentDate
        })

        await this.positionStore.save(position)
        return position
    }

    public async updatePosition(
        position: DAMMLiquidityPosition,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        position.lpTokenAmount = lpTokenAmount
        position.updatedAt = new Date(timestamp * 1000)
        await this.positionStore.update(position)
    }

    public async recordLiquidityChange(
        pool: DAMMPool,
        position: DAMMLiquidityPosition,
        type: 'add' | 'remove' | 'bootstrap' | 'singleSide',
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const change = new DAMMLiquidityChange({
            id: `${pool.id}-${position.owner}-${timestamp}`,
            pool,
            position,
            type,
            tokenXAmount,
            tokenYAmount,
            lpTokenAmount,
            timestamp: new Date(timestamp * 1000)
        })

        await this.liquidityChangeStore.save(change)
    }

    public async handleAddBalancedLiquidity(
        pool: DAMMPool,
        owner: string,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const position = await this.getOrCreatePosition(pool, owner, timestamp)
        await this.updatePosition(position, position.lpTokenAmount + lpTokenAmount, timestamp)
        await this.recordLiquidityChange(pool, position, 'add', tokenXAmount, tokenYAmount, lpTokenAmount, timestamp)
    }

    public async handleRemoveBalancedLiquidity(
        pool: DAMMPool,
        owner: string,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const position = await this.getOrCreatePosition(pool, owner, timestamp)
        await this.updatePosition(position, position.lpTokenAmount - lpTokenAmount, timestamp)
        await this.recordLiquidityChange(pool, position, 'remove', tokenXAmount, tokenYAmount, lpTokenAmount, timestamp)
    }

    public async handleAddImbalancedLiquidity(
        pool: DAMMPool,
        owner: string,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const position = await this.getOrCreatePosition(pool, owner, timestamp)
        await this.updatePosition(position, position.lpTokenAmount + lpTokenAmount, timestamp)
        await this.recordLiquidityChange(pool, position, 'add', tokenXAmount, tokenYAmount, lpTokenAmount, timestamp)
    }

    public async handleRemoveSingleSideLiquidity(
        pool: DAMMPool,
        owner: string,
        tokenAmount: bigint,
        lpTokenAmount: bigint,
        isTokenX: boolean,
        timestamp: number
    ): Promise<void> {
        const position = await this.getOrCreatePosition(pool, owner, timestamp)
        await this.updatePosition(position, position.lpTokenAmount - lpTokenAmount, timestamp)
        await this.recordLiquidityChange(
            pool,
            position,
            'singleSide',
            isTokenX ? tokenAmount : 0n,
            isTokenX ? 0n : tokenAmount,
            lpTokenAmount,
            timestamp
        )
    }

    public async handleBootstrapLiquidity(
        pool: DAMMPool,
        owner: string,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        lpTokenAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const position = await this.getOrCreatePosition(pool, owner, timestamp)
        await this.updatePosition(position, position.lpTokenAmount + lpTokenAmount, timestamp)
        await this.recordLiquidityChange(pool, position, 'bootstrap', tokenXAmount, tokenYAmount, lpTokenAmount, timestamp)
    }

    public getAllPositions(): DAMMLiquidityPosition[] {
        return this.positionStore.getAll()
    }

    public getAllLiquidityChanges(): DAMMLiquidityChange[] {
        return this.liquidityChangeStore.getAll()
    }
}
