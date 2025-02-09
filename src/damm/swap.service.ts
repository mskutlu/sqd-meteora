import { DAMMPool, DAMMSwap } from '../model'
import { MemoryStore, StoreManager } from '../store/memory.store'
import { createSwapId } from '../utils'

export class SwapService {
    private swapStore: MemoryStore<DAMMSwap>
    private swapIndices: Map<string, number> = new Map()

    constructor(private storeManager: StoreManager) {
        this.swapStore = storeManager.getStore<DAMMSwap>('DAMMSwap', true)
    }

    private getNextSwapIndex(transactionId: string): number {
        const currentIndex = this.swapIndices.get(transactionId) || 0
        this.swapIndices.set(transactionId, currentIndex + 1)
        return currentIndex
    }

    public async createSwap(
        transactionId: string,
        pool: DAMMPool,
        userAddress: string,
        tokenInMint: string,
        tokenOutMint: string,
        inAmount: bigint,
        outAmount: bigint,
        timestamp: number
    ): Promise<DAMMSwap> {

        const swapIndex = this.getNextSwapIndex(transactionId)
        const swapDate = new Date(timestamp * 1000)

        const swap = new DAMMSwap({
            id: createSwapId(transactionId, swapIndex),
            pool,
            userAddress,
            tokenInMint,
            tokenOutMint,
            amountIn: inAmount,
            amountOut: outAmount,
            timestamp: swapDate
        })

        await this.swapStore.save(swap)
        return swap
    }

    public getAllSwaps(): DAMMSwap[] {
        return this.swapStore.getAll()
    }
}
