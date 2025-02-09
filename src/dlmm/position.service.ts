import { DLMMPool, DLMMPosition } from '../model/generated'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createPositionId } from '../utils'

export class PositionService {
    private positionStore: MemoryStore<DLMMPosition>

    constructor(private storeManager: StoreManager) {
        this.positionStore = storeManager.getStore<DLMMPosition>('DLMMPosition')
    }

    public async getOrCreatePosition(
        positionAddress: string,
        pool: DLMMPool,
        owner: string,
        lowerBinId: number,
        upperBinId: number,
        operator?: string,
        feeOwner?: string,
        lockReleasePoint?: bigint,
        timestamp?: number
    ): Promise<DLMMPosition> {
        const positionId = createPositionId(positionAddress, owner)
        const existingPosition = await this.positionStore.find(positionId)
        if (existingPosition) {
            return existingPosition
        }

        const currentDate = timestamp ? new Date(timestamp * 1000) : new Date()
        const position = new DLMMPosition()
        position.id = positionId
        position.pool = pool
        position.owner = owner
        position.operator = operator
        position.lowerBinId = lowerBinId
        position.upperBinId = upperBinId
        position.liquidity = 0n
        position.tokenXAmount = 0n
        position.tokenYAmount = 0n
        position.feeOwner = feeOwner
        position.lockReleasePoint = lockReleasePoint
        position.createdAt = currentDate
        position.updatedAt = currentDate

        await this.positionStore.save(position)
        return position
    }

    public async updatePosition(
        position: DLMMPosition,
        liquidity: bigint,
        tokenXAmount: bigint,
        tokenYAmount: bigint,
        operator?: string,
        timestamp?: number
    ): Promise<void> {
        position.liquidity = liquidity
        position.tokenXAmount = tokenXAmount
        position.tokenYAmount = tokenYAmount
        if (operator !== undefined) position.operator = operator
        if (timestamp) position.updatedAt = new Date(timestamp * 1000)
        await this.positionStore.update(position)
    }

    public async getPosition(positionId: string): Promise<DLMMPosition | undefined> {
        return this.positionStore.find(positionId)
    }

    public getAllPositions(): DLMMPosition[] {
        return this.positionStore.getAll()
    }
}
