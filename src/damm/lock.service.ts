import { DAMMLock, DAMMPool } from '../model'
import { MemoryStore, StoreManager } from '../store/memory.store'

export class LockService {
    private lockStore: MemoryStore<DAMMLock>

    constructor(private storeManager: StoreManager) {
        this.lockStore = storeManager.getStore<DAMMLock>('DAMMLock')
    }

    public async getOrCreateLock(
        owner: string,
        pool: DAMMPool,
        timestamp: number
    ): Promise<DAMMLock> {
        const id = `${pool.id}-${owner}`
        let lock = await this.lockStore.find(id)

        if (!lock) {
            lock = new DAMMLock({
                id,
                pool,
                owner,
                amount: 0n,
                createdAt: new Date(timestamp * 1000),
                updatedAt: new Date(timestamp * 1000)
            })
            await this.lockStore.save(lock)
        }

        return lock
    }

    public async updateLock(
        lock: DAMMLock,
        amount: bigint,
        timestamp: number
    ): Promise<void> {
        lock.amount = amount
        lock.updatedAt = new Date(timestamp * 1000)
        await this.lockStore.update(lock)
    }

    public getAllLocks(): DAMMLock[] {
        return this.lockStore.getAll()
    }
}
