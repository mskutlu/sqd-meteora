import { PublicKey } from '@solana/web3.js'
import { Store } from '@subsquid/typeorm-store'
import { BasePool } from './model'
import { DataHandlerContext } from "@subsquid/batch-processor"
import {Block, Instruction} from "@subsquid/solana-objects"
import * as fs from 'fs'
import * as path from 'path'
import * as tokenProgram from "./abi/token-program";
import * as systemProgram from "./abi/system-program";

export function createPoolId(address: string): string {
    return new PublicKey(address).toBase58()
}

export function createSwapId(txId: string, logIndex: number): string {
    return `${txId}-${logIndex}`
}

export function createPositionId(poolAddress: string, owner: string): string {
    return `${poolAddress}-${owner}`
}

export function createFeeId(txId: string, logIndex: number): string {
    return `${txId}-${logIndex}`
}

export function createLockId(poolAddress: string, owner: string): string {
    return `${poolAddress}-${owner}`
}

export function createLiquidityChangeId(): string {
    return `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`
}

export function createRewardId(poolId: string, rewardIndex: number): string {
    return `${poolId}-${rewardIndex}`
}

export async function getOrCreateBasePool(
    ctx: DataHandlerContext<Block, Store>,
    poolAddress: string,
): Promise<BasePool> {
    const poolId = createPoolId(poolAddress)
    let pool = await ctx.store.get(BasePool, poolId)
    
    if (pool == null) {
        pool = new BasePool({
            id: poolId,
            tokenX: '',
            tokenY: '',
            reserveX: 0n,
            reserveY: 0n,
            totalLiquidity: 0n,
            status: true, // Enable by default
            createdAt: new Date(ctx.blocks[0].header.timestamp),
            updatedAt: new Date(ctx.blocks[0].header.timestamp)
        })
        await ctx.store.save(pool)
    }
    
    return pool
}

export function updateBasePool(
    pool: BasePool,
    reserveX: bigint,
    reserveY: bigint,
    totalLiquidity: bigint,
    timestamp: number
): void {
    pool.reserveX = reserveX
    pool.reserveY = reserveY
    pool.totalLiquidity = totalLiquidity
    pool.updatedAt = new Date(timestamp)
}

// Convert basis points (bps) to decimals
// e.g., 10000 bps = 100%, 100 bps = 1%
export function bpsToDecimal(bps: number): number {
    return bps / 10000
}

// Convert lamports to SOL
export function lamportsToSol(lamports: bigint): number {
    return Number(lamports) / 1e9
}

// Get account data from accounts array by index
export function getAccountByIndex(accounts: string[], index: number): string {
    if (index >= accounts.length) {
        throw new Error(`Account index ${index} out of bounds`)
    }
    return accounts[index]
}

// Parse instruction data using layout
export function parseInstructionData<T>(data: Buffer | string, layout: any): T {
    try {
        // Convert data to Buffer if it's a string
        const buffer = typeof data === 'string' ? Buffer.from(data, 'base64') : data
        if (!buffer || buffer.length === 0) {
            throw new Error('Empty instruction data')
        }

        // Decode the instruction using the layout's decode method
        const decoded = layout.decode({
            data: buffer,
            accounts: [] // We don't need accounts for data decoding
        })

        // Return the data portion of the decoded instruction
        return decoded.data as T
    } catch (error) {
        console.error('Error parsing instruction data:', error)
        throw new Error(`Failed to parse instruction data: ${error instanceof Error ? error.message : String(error)}`)
    }
}

// Helper function to convert BigInt to string in objects
function convertBigIntToString(obj: any): any {
    if (obj === null || obj === undefined) {
        return obj;
    }

    if (typeof obj === 'bigint') {
        return obj.toString();
    }

    if (Array.isArray(obj)) {
        return obj.map(convertBigIntToString);
    }

    if (typeof obj === 'object') {
        const converted: any = {};
        for (const key in obj) {
            converted[key] = convertBigIntToString(obj[key]);
        }
        return converted;
    }

    return obj;
}

export function writeLog(type: string, data: any) {
    const logsDir = path.join(process.cwd(), 'logs')
    const date = new Date()
    const fileName = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}.log`
    const logPath = path.join(logsDir, fileName)

    // Create logs directory if it doesn't exist
    if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true })
    }

    // Convert any BigInt values to strings before creating log entry
    const safeData = convertBigIntToString(data)

    const logEntry = {
        timestamp: date.toISOString(),
        type,
        data: safeData
    }

    // Custom replacer function for JSON.stringify to handle any remaining BigInt values
    const replacer = (key: string, value: any) => {
        if (typeof value === 'bigint') {
            return value.toString()
        }
        if (value instanceof Error) {
            return {
                message: value.message,
                stack: value.stack,
                name: value.name
            }
        }
        return value
    }

    // Append to log file with custom replacer
    fs.appendFileSync(logPath, JSON.stringify(logEntry, replacer, 2) + '\n')
}

// Set to track logged layouts
const loggedLayouts = new Set<string>()

export function writeLayoutLog(processor: string, layout: string, data: any) {
    // Create a unique key for this layout
    const layoutKey = `${processor}-${layout}`
    
    // Only log if we haven't seen this layout before
    if (!loggedLayouts.has(layoutKey)) {
        writeLog('layout', {
            processor,
            d8: layout,
            data
        })
        
        // Mark this layout as logged
        loggedLayouts.add(layoutKey)
    }
}

export function decodeTokenTransfers(ins: Instruction) {
    const transfers: Array<{
        source: string;
        destination: string;
        signer: string;
        amount: bigint;
        preMint?: string;
        postMint?: string;
        preOwner?: string;
        postOwner?: string;
    }> = [];

    const tokenInstructions = ins.inner.filter(
        f => f.programId.toLowerCase() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'.toLowerCase()
    );

    for (const tokenIns of tokenInstructions) {
        try {
            const transfer = tokenProgram.instructions.transfer.decode(tokenIns);
            if (!transfer?.accounts?.source || !transfer?.accounts?.destination) continue;

            const srcBalance = ins.getTransaction().tokenBalances.find(tb => tb.account === transfer.accounts.source);
            const destBalance = ins.getTransaction().tokenBalances.find(tb => tb.account === transfer.accounts.destination);

            transfers.push({
                source: transfer.accounts.source,
                destination: transfer.accounts.destination,
                signer: transfer.accounts.signer,
                amount: transfer.data.amount,
                preMint: srcBalance?.preMint,
                postMint: destBalance?.postMint,
                preOwner: srcBalance?.preOwner,
                postOwner: destBalance?.postOwner
            });
        } catch (e) {
            // Skip non-transfer instructions
            //console.log(e)

        }
    }

    return transfers;
}

export function decodeTokenTransfersChecked(ins: Instruction) {
    const transfersChecked: Array<{
        source: string;
        destination: string;
        signer: string;
        amount: bigint;
        mint: string;
        decimals: number;
        preMint?: string;
        postMint?: string;
        preOwner?: string;
        postOwner?: string;
    }> = [];

    const tokenInstructions = ins.inner.filter(
        f => f.programId.toLowerCase() === 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'.toLowerCase()
    );

    for (const tokenIns of tokenInstructions) {
        try {
            const transferChecked = tokenProgram.instructions.transferChecked.decode(tokenIns);
            if (
                !transferChecked?.accounts?.source ||
                !transferChecked?.accounts?.destination ||
                !transferChecked?.accounts?.mint
            )
                continue;

            const srcBalance = ins.getTransaction().tokenBalances.find(tb => tb.account === transferChecked.accounts.source);
            const destBalance = ins.getTransaction().tokenBalances.find(tb => tb.account === transferChecked.accounts.destination);

            transfersChecked.push({
                source: transferChecked.accounts.source,
                destination: transferChecked.accounts.destination,
                signer: transferChecked.accounts.signer,
                amount: transferChecked.data.amount,
                mint: transferChecked.accounts.mint,
                decimals: transferChecked.data.decimals,
                preMint: srcBalance?.preMint,
                postMint: destBalance?.postMint,
                preOwner: srcBalance?.preOwner,
                postOwner: destBalance?.postOwner
            });
        } catch (e) {
            // Skip non-transferChecked instructions
            // console.log(e);
        }
    }

    return transfersChecked;
}

export function decodeSystemCreateAccounts(ins: Instruction) {
    const createAccounts: Array<{
        source: string;
        newAccount: string;
        lamports: bigint;
        space: bigint;
        owner: string;
    }> = [];

    const systemInstructions = ins.inner.filter(
        f => f.programId.toLowerCase() === '11111111111111111111111111111111'.toLowerCase()
    );

    for (const systemIns of systemInstructions) {
        try {
            const createAccount = systemProgram.instructions.createAccount.decode(systemIns);
            if (!createAccount?.accounts?.source || !createAccount?.accounts?.newAccount) continue;

            createAccounts.push({
                source: createAccount.accounts.source,
                newAccount: createAccount.accounts.newAccount,
                lamports: createAccount.data.lamports,
                space: createAccount.data.space,
                owner: createAccount.data.owner,
            });
        } catch (e) {
            // Skip non-createAccount instructions
        }
    }

    return createAccounts;
}
