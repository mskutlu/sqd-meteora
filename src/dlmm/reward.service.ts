import { DLMMPool, DLMMReward } from '../model/generated'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createRewardId } from '../utils'

export class RewardService {
    private rewardStore: MemoryStore<DLMMReward>

    constructor(private storeManager: StoreManager) {
        this.rewardStore = storeManager.getStore<DLMMReward>('DLMMReward')
    }

    public async createReward(
        pool: DLMMPool,
        rewardIndex: number,
        rewardDuration: bigint,
        funder: string,
        amount: bigint,
        timestamp: number
    ): Promise<DLMMReward> {
        const rewardId = createRewardId(pool.id, rewardIndex)
        const reward = new DLMMReward()
        reward.id = rewardId
        reward.pool = pool
        reward.rewardIndex = rewardIndex
        reward.rewardDuration = rewardDuration
        reward.funder = funder
        reward.amount = amount
        reward.lastUpdateTime = new Date(timestamp * 1000)
        reward.createdAt = new Date(timestamp * 1000)

        await this.rewardStore.save(reward)
        return reward
    }

    public async updateReward(
        reward: DLMMReward,
        amount: bigint,
        timestamp: number
    ): Promise<void> {
        reward.amount = amount
        reward.lastUpdateTime = new Date(timestamp * 1000)
        await this.rewardStore.update(reward)
    }

    public async getReward(poolId: string, rewardIndex: number): Promise<DLMMReward | undefined> {
        const rewardId = createRewardId(poolId, rewardIndex)
        return this.rewardStore.find(rewardId)
    }

    public getAllRewards(): DLMMReward[] {
        return this.rewardStore.getAll()
    }
}
