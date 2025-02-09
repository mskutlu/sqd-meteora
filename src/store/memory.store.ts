import { DataHandlerContext } from "@subsquid/batch-processor"
import { Store } from '@subsquid/typeorm-store'

export class MemoryStore<T extends { id: string }> {
    private store: Map<string, T> = new Map()
    private eventStore: T[] = []

    constructor(
        private readonly name: string,
        private readonly isEventType: boolean = false
    ) {}

    public async find(id: string): Promise<T | undefined> {
        return this.store.get(id)
    }

    public async save(item: T): Promise<void> {
        if (this.isEventType) {
            this.eventStore.push(item)
            // console.log(`[MEMORY_STORE] ${this.name} event saved:`, this.safeLog(item))
        } else {
            this.store.set(item.id, item)
            // console.log(`[MEMORY_STORE] ${this.name} saved:`, this.safeLog(item))
        }
    }

    public async update(item: T): Promise<void> {
        if (this.isEventType) {
            throw new Error('Cannot update event type entities')
        }
        this.store.set(item.id, item)
        // console.log(`[MEMORY_STORE] ${this.name} updated:`, this.safeLog(item))
    }

    public getAll(): T[] {
        return this.isEventType 
            ? this.eventStore 
            : Array.from(this.store.values())
    }

    public getAllValues(): T[] {
        if (this.isEventType) {
            return this.eventStore
        } else {
            return Array.from(this.store.values())
        }
    }

    private safeLog(data: any): any {
        const seen = new WeakSet()
        return JSON.stringify(data, (key, value) => {
            if (typeof value === "bigint") {
                return value.toString()
            }
            if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                    return "[Circular]"
                }
                seen.add(value)
            }
            return value
        }, 2)
    }
}

export class StoreManager {
    private stores: Map<string, MemoryStore<any>> = new Map()

    constructor(public readonly ctx: DataHandlerContext<any, Store>) {}

    public getStore<T extends { id: string }>(
        name: string, 
        isEventType: boolean = false
    ): MemoryStore<T> {
        let store = this.stores.get(name)
        if (!store) {
            store = new MemoryStore<T>(name, isEventType)
            this.stores.set(name, store)
        }
        return store
    }

    public getAllStores(): Map<string, MemoryStore<any>> {
        return this.stores
    }
}
