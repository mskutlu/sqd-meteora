import { DAMMFee, DAMMPool } from '../model'
import { MemoryStore, StoreManager } from '../store/memory.store'

export class FeeService {
    private feeStore: MemoryStore<DAMMFee>

    constructor(private storeManager: StoreManager) {
        this.feeStore = storeManager.getStore<DAMMFee>('DAMMFee')
    }

    public async createFee(
        transactionId: string,
        pool: DAMMPool,
        owner: string,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        timestamp: number
    ): Promise<void> {
        const id = `${pool.id}:${transactionId}`
        const fee = new DAMMFee({
            id,
            pool,
            owner,
            tokenXAmount,
            tokenYAmount,
            timestamp: new Date(timestamp * 1000)
        })
        await this.feeStore.save(fee)
    }

    public getAllFees(): DAMMFee[] {
        return this.feeStore.getAll()
    }
}
