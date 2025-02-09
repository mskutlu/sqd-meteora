import { DLMMPool, DLMMPosition, DLMMLiquidityChange } from '../model/generated'
import { MemoryStore, StoreManager } from '../store/memory.store'

export class LiquidityService {
    private liquidityChangeStore: MemoryStore<DLMMLiquidityChange>

    constructor(private storeManager: StoreManager) {
        this.liquidityChangeStore = storeManager.getStore<DLMMLiquidityChange>('DLMMLiquidityChange')
    }

    public async recordLiquidityChange(
        pool: DLMMPool,
        position: DLMMPosition,
        type: 'add' | 'remove',
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const change = new DLMMLiquidityChange({
            id: `${pool.id}-${position.owner}-${timestamp}`,
            pool,
            position,
            type,
            tokenXAmount,
            tokenYAmount,
            timestamp: new Date(timestamp * 1000)
        })

        await this.liquidityChangeStore.save(change)
    }

    public getAllLiquidityChanges(): DLMMLiquidityChange[] {
        return this.liquidityChangeStore.getAll()
    }
}
