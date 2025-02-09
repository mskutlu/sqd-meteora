import { DLMMPool, DLMMSwap } from '../model/generated'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createSwapId } from '../utils'

export class SwapService {
    private swapStore: MemoryStore<DLMMSwap>
    private swapIndices: Map<string, number> = new Map()

    constructor(private storeManager: StoreManager) {
        this.swapStore = storeManager.getStore<DLMMSwap>('DLMMSwap', true)
    }

    private getNextSwapIndex(transactionId: string): number {
        const currentIndex = this.swapIndices.get(transactionId) || 0
        this.swapIndices.set(transactionId, currentIndex + 1)
        return currentIndex
    }

    public async createSwap(
        transactionId: string,
        pool: DLMMPool,
        userAddress: string,
        tokenInMint: string,
        tokenOutMint: string,
        inAmount: bigint,
        outAmount: bigint,
        timestamp: number
    ): Promise<DLMMSwap> {
        const swapIndex = this.getNextSwapIndex(transactionId)
        const swapDate = new Date(timestamp * 1000)

        const swap = new DLMMSwap({
            id: createSwapId(transactionId, swapIndex),
            pool,
            userAddress,
            tokenInAddress: tokenInMint,
            tokenOutAddress: tokenOutMint,
            amountIn: inAmount,
            amountOut: outAmount,
            timestamp: swapDate
        })

        await this.swapStore.save(swap)
        return swap
    }

    public getAllSwaps(): DLMMSwap[] {
        return this.swapStore.getAll()
    }
}
