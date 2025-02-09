import { MemoryStore, StoreManager } from '../store/memory.store'
import { DlmmFee } from "../model/generated/dlmmFee.model"
import { DLMMPool } from "../model/generated/dlmmPool.model"

export class FeeService {
    public readonly feeStore: MemoryStore<DlmmFee>

    constructor(private storeManager: StoreManager) {
        this.feeStore = storeManager.getStore<DlmmFee>('DlmmFee')
    }

    public async createFeeClaim(
        txId: string,
        pool: DLMMPool,
        position: string,
        user: string,
        amountX: bigint,
        amountY: bigint,
        timestamp: number,
        type: 'in' | 'out'
    ): Promise<DlmmFee> {
        const fee = new DlmmFee({
            id: `${txId}-${type}-${position}`,
            pool,
            position,
            user,
            amountX,
            amountY,
            type,
            timestamp
        })

        await this.feeStore.save(fee)
        return fee
    }
}
