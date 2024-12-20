import {struct, array, u64, u16, u8, unit} from '@subsquid/borsh'
import {instruction} from '../abi.support'
import {RoutePlanStep} from './types'

/**
 * route_plan Topologically sorted trade DAG
 */
export interface Route {
    routePlan: Array<RoutePlanStep>
    inAmount: bigint
    quotedOutAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

/**
 * route_plan Topologically sorted trade DAG
 */
export const route = instruction(
    {
        d8: '0xe517cb977ae3ad2a',
    },
    {
        tokenProgram: 0,
        userTransferAuthority: 1,
        userSourceTokenAccount: 2,
        userDestinationTokenAccount: 3,
        destinationTokenAccount: 4,
        destinationMint: 5,
        platformFeeAccount: 6,
        eventAuthority: 7,
        program: 8,
    },
    struct({
        routePlan: array(RoutePlanStep),
        inAmount: u64,
        quotedOutAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

export interface RouteWithTokenLedger {
    routePlan: Array<RoutePlanStep>
    quotedOutAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

export const routeWithTokenLedger = instruction(
    {
        d8: '0x96564774a75d0e68',
    },
    {
        tokenProgram: 0,
        userTransferAuthority: 1,
        userSourceTokenAccount: 2,
        userDestinationTokenAccount: 3,
        destinationTokenAccount: 4,
        destinationMint: 5,
        platformFeeAccount: 6,
        tokenLedger: 7,
        eventAuthority: 8,
        program: 9,
    },
    struct({
        routePlan: array(RoutePlanStep),
        quotedOutAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

export interface ExactOutRoute {
    routePlan: Array<RoutePlanStep>
    outAmount: bigint
    quotedInAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

export const exactOutRoute = instruction(
    {
        d8: '0xd033ef977b2bed5c',
    },
    {
        tokenProgram: 0,
        userTransferAuthority: 1,
        userSourceTokenAccount: 2,
        userDestinationTokenAccount: 3,
        destinationTokenAccount: 4,
        sourceMint: 5,
        destinationMint: 6,
        platformFeeAccount: 7,
        token2022Program: 8,
        eventAuthority: 9,
        program: 10,
    },
    struct({
        routePlan: array(RoutePlanStep),
        outAmount: u64,
        quotedInAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

/**
 * Route by using program owned token accounts and open orders accounts.
 */
export interface SharedAccountsRoute {
    id: number
    routePlan: Array<RoutePlanStep>
    inAmount: bigint
    quotedOutAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

/**
 * Route by using program owned token accounts and open orders accounts.
 */
export const sharedAccountsRoute = instruction(
    {
        d8: '0xc1209b3341d69c81',
    },
    {
        tokenProgram: 0,
        programAuthority: 1,
        userTransferAuthority: 2,
        sourceTokenAccount: 3,
        programSourceTokenAccount: 4,
        programDestinationTokenAccount: 5,
        destinationTokenAccount: 6,
        sourceMint: 7,
        destinationMint: 8,
        platformFeeAccount: 9,
        token2022Program: 10,
        eventAuthority: 11,
        program: 12,
    },
    struct({
        id: u8,
        routePlan: array(RoutePlanStep),
        inAmount: u64,
        quotedOutAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

export interface SharedAccountsRouteWithTokenLedger {
    id: number
    routePlan: Array<RoutePlanStep>
    quotedOutAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

export const sharedAccountsRouteWithTokenLedger = instruction(
    {
        d8: '0xe6798f50779f6aaa',
    },
    {
        tokenProgram: 0,
        programAuthority: 1,
        userTransferAuthority: 2,
        sourceTokenAccount: 3,
        programSourceTokenAccount: 4,
        programDestinationTokenAccount: 5,
        destinationTokenAccount: 6,
        sourceMint: 7,
        destinationMint: 8,
        platformFeeAccount: 9,
        token2022Program: 10,
        tokenLedger: 11,
        eventAuthority: 12,
        program: 13,
    },
    struct({
        id: u8,
        routePlan: array(RoutePlanStep),
        quotedOutAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

/**
 * Route by using program owned token accounts and open orders accounts.
 */
export interface SharedAccountsExactOutRoute {
    id: number
    routePlan: Array<RoutePlanStep>
    outAmount: bigint
    quotedInAmount: bigint
    slippageBps: number
    platformFeeBps: number
}

/**
 * Route by using program owned token accounts and open orders accounts.
 */
export const sharedAccountsExactOutRoute = instruction(
    {
        d8: '0xb0d169a89a7d453e',
    },
    {
        tokenProgram: 0,
        programAuthority: 1,
        userTransferAuthority: 2,
        sourceTokenAccount: 3,
        programSourceTokenAccount: 4,
        programDestinationTokenAccount: 5,
        destinationTokenAccount: 6,
        sourceMint: 7,
        destinationMint: 8,
        platformFeeAccount: 9,
        token2022Program: 10,
        eventAuthority: 11,
        program: 12,
    },
    struct({
        id: u8,
        routePlan: array(RoutePlanStep),
        outAmount: u64,
        quotedInAmount: u64,
        slippageBps: u16,
        platformFeeBps: u8,
    }),
)

export type SetTokenLedger = undefined

export const setTokenLedger = instruction(
    {
        d8: '0xe455b9704e4f4d02',
    },
    {
        tokenLedger: 0,
        tokenAccount: 1,
    },
    unit,
)

export type CreateOpenOrders = undefined

export const createOpenOrders = instruction(
    {
        d8: '0xe5c2d4ac080a8693',
    },
    {
        openOrders: 0,
        payer: 1,
        dexProgram: 2,
        systemProgram: 3,
        rent: 4,
        market: 5,
    },
    unit,
)

export interface CreateTokenAccount {
    bump: number
}

export const createTokenAccount = instruction(
    {
        d8: '0x93f17b64f484ae76',
    },
    {
        tokenAccount: 0,
        user: 1,
        mint: 2,
        tokenProgram: 3,
        systemProgram: 4,
    },
    struct({
        bump: u8,
    }),
)

export interface CreateProgramOpenOrders {
    id: number
}

export const createProgramOpenOrders = instruction(
    {
        d8: '0x1ce22094bc8871ab',
    },
    {
        openOrders: 0,
        payer: 1,
        programAuthority: 2,
        dexProgram: 3,
        systemProgram: 4,
        rent: 5,
        market: 6,
    },
    struct({
        id: u8,
    }),
)

export interface Claim {
    id: number
}

export const claim = instruction(
    {
        d8: '0x3ec6d6c1d59f6cd2',
    },
    {
        wallet: 0,
        programAuthority: 1,
        systemProgram: 2,
    },
    struct({
        id: u8,
    }),
)

export interface ClaimToken {
    id: number
}

export const claimToken = instruction(
    {
        d8: '0x74ce1bbfa6130049',
    },
    {
        payer: 0,
        wallet: 1,
        programAuthority: 2,
        programTokenAccount: 3,
        destinationTokenAccount: 4,
        mint: 5,
        associatedTokenTokenProgram: 6,
        associatedTokenProgram: 7,
        systemProgram: 8,
    },
    struct({
        id: u8,
    }),
)

export type CreateTokenLedger = undefined

export const createTokenLedger = instruction(
    {
        d8: '0xe8f2c5fdf08f8134',
    },
    {
        tokenLedger: 0,
        payer: 1,
        systemProgram: 2,
    },
    unit,
)

export type MercurialSwap = undefined

export const mercurialSwap = instruction(
    {
        d8: '0x02054dadc500079d',
    },
    {
        swapProgram: 0,
        swapState: 1,
        tokenProgram: 2,
        poolAuthority: 3,
        userTransferAuthority: 4,
        sourceTokenAccount: 5,
        destinationTokenAccount: 6,
    },
    unit,
)

export type CykuraSwap = undefined

export const cykuraSwap = instruction(
    {
        d8: '0x26f1156b783bb8f9',
    },
    {
        swapProgram: 0,
        signer: 1,
        factoryState: 2,
        poolState: 3,
        inputTokenAccount: 4,
        outputTokenAccount: 5,
        inputVault: 6,
        outputVault: 7,
        lastObservationState: 8,
        coreProgram: 9,
        tokenProgram: 10,
    },
    unit,
)

export type SerumSwap = undefined

export const serumSwap = instruction(
    {
        d8: '0x58b746f9d67652d2',
    },
    {
        marketMarket: 0,
        marketOpenOrders: 1,
        marketRequestQueue: 2,
        marketEventQueue: 3,
        marketBids: 4,
        marketAsks: 5,
        marketCoinVault: 6,
        marketPcVault: 7,
        marketVaultSigner: 8,
        authority: 9,
        orderPayerTokenAccount: 10,
        coinWallet: 11,
        pcWallet: 12,
        dexProgram: 13,
        tokenProgram: 14,
        rent: 15,
    },
    unit,
)

export type SaberSwap = undefined

export const saberSwap = instruction(
    {
        d8: '0x403e62e2344a25b2',
    },
    {
        swapProgram: 0,
        tokenProgram: 1,
        swap: 2,
        swapAuthority: 3,
        userAuthority: 4,
        inputUserAccount: 5,
        inputTokenAccount: 6,
        outputUserAccount: 7,
        outputTokenAccount: 8,
        feesTokenAccount: 9,
    },
    unit,
)

export type SaberAddDecimals = undefined

export const saberAddDecimals = instruction(
    {
        d8: '0x2435e7b807b505ee',
    },
    {
        addDecimalsProgram: 0,
        wrapper: 1,
        wrapperMint: 2,
        wrapperUnderlyingTokens: 3,
        owner: 4,
        userUnderlyingTokens: 5,
        userWrappedTokens: 6,
        tokenProgram: 7,
    },
    unit,
)

export type TokenSwap = undefined

export const tokenSwap = instruction(
    {
        d8: '0xbbc076d43e6d1cd5',
    },
    {
        tokenSwapProgram: 0,
        tokenProgram: 1,
        swap: 2,
        authority: 3,
        userTransferAuthority: 4,
        source: 5,
        swapSource: 6,
        swapDestination: 7,
        destination: 8,
        poolMint: 9,
        poolFee: 10,
    },
    unit,
)

export type TokenSwapV2 = undefined

export const tokenSwapV2 = instruction(
    {
        d8: '0x333091737b5f478a',
    },
    {
        swapProgram: 0,
        swap: 1,
        authority: 2,
        userTransferAuthority: 3,
        source: 4,
        swapSource: 5,
        swapDestination: 6,
        destination: 7,
        poolMint: 8,
        poolFee: 9,
        sourceMint: 10,
        destinationMint: 11,
        sourceTokenProgram: 12,
        destinationTokenProgram: 13,
        poolTokenProgram: 14,
    },
    unit,
)

export type SenchaSwap = undefined

export const senchaSwap = instruction(
    {
        d8: '0x19320715cff8e6c2',
    },
    {
        swapProgram: 0,
        tokenProgram: 1,
        swap: 2,
        userAuthority: 3,
        inputUserAccount: 4,
        inputTokenAccount: 5,
        inputFeesAccount: 6,
        outputUserAccount: 7,
        outputTokenAccount: 8,
        outputFeesAccount: 9,
    },
    unit,
)

export type StepSwap = undefined

export const stepSwap = instruction(
    {
        d8: '0x9b38d0c61b3d95e9',
    },
    {
        tokenSwapProgram: 0,
        tokenProgram: 1,
        swap: 2,
        authority: 3,
        userTransferAuthority: 4,
        source: 5,
        swapSource: 6,
        swapDestination: 7,
        destination: 8,
        poolMint: 9,
        poolFee: 10,
    },
    unit,
)

export type CropperSwap = undefined

export const cropperSwap = instruction(
    {
        d8: '0xe6d82fb6a575d267',
    },
    {
        tokenSwapProgram: 0,
        tokenProgram: 1,
        swap: 2,
        swapState: 3,
        authority: 4,
        userTransferAuthority: 5,
        source: 6,
        swapSource: 7,
        swapDestination: 8,
        destination: 9,
        poolMint: 10,
        poolFee: 11,
    },
    unit,
)

export type RaydiumSwap = undefined

export const raydiumSwap = instruction(
    {
        d8: '0xb1ad2af0b8047c51',
    },
    {
        swapProgram: 0,
        tokenProgram: 1,
        ammId: 2,
        ammAuthority: 3,
        ammOpenOrders: 4,
        poolCoinTokenAccount: 5,
        poolPcTokenAccount: 6,
        serumProgramId: 7,
        serumMarket: 8,
        serumBids: 9,
        serumAsks: 10,
        serumEventQueue: 11,
        serumCoinVaultAccount: 12,
        serumPcVaultAccount: 13,
        serumVaultSigner: 14,
        userSourceTokenAccount: 15,
        userDestinationTokenAccount: 16,
        userSourceOwner: 17,
    },
    unit,
)

export type CremaSwap = undefined

export const cremaSwap = instruction(
    {
        d8: '0xa9dc29fa23be85c6',
    },
    {
        swapProgram: 0,
        clmmConfig: 1,
        clmmpool: 2,
        tokenA: 3,
        tokenB: 4,
        accountA: 5,
        accountB: 6,
        tokenAVault: 7,
        tokenBVault: 8,
        tickArrayMap: 9,
        owner: 10,
        partner: 11,
        partnerAtaA: 12,
        partnerAtaB: 13,
        tokenProgram: 14,
    },
    unit,
)

export type LifinitySwap = undefined

export const lifinitySwap = instruction(
    {
        d8: '0x1760a5215ad66099',
    },
    {
        swapProgram: 0,
        authority: 1,
        amm: 2,
        userTransferAuthority: 3,
        sourceInfo: 4,
        destinationInfo: 5,
        swapSource: 6,
        swapDestination: 7,
        poolMint: 8,
        feeAccount: 9,
        tokenProgram: 10,
        pythAccount: 11,
        pythPcAccount: 12,
        configAccount: 13,
    },
    unit,
)

export type MarinadeDeposit = undefined

export const marinadeDeposit = instruction(
    {
        d8: '0x3eecf81cdee8b649',
    },
    {
        marinadeFinanceProgram: 0,
        state: 1,
        msolMint: 2,
        liqPoolSolLegPda: 3,
        liqPoolMsolLeg: 4,
        liqPoolMsolLegAuthority: 5,
        reservePda: 6,
        transferFrom: 7,
        mintTo: 8,
        msolMintAuthority: 9,
        systemProgram: 10,
        tokenProgram: 11,
        userWsolTokenAccount: 12,
        tempWsolTokenAccount: 13,
        userTransferAuthority: 14,
        payer: 15,
        wsolMint: 16,
        rent: 17,
    },
    unit,
)

export type MarinadeUnstake = undefined

export const marinadeUnstake = instruction(
    {
        d8: '0x29780f0071db2a01',
    },
    {
        marinadeFinanceProgram: 0,
        state: 1,
        msolMint: 2,
        liqPoolSolLegPda: 3,
        liqPoolMsolLeg: 4,
        treasuryMsolAccount: 5,
        getMsolFrom: 6,
        getMsolFromAuthority: 7,
        transferSolTo: 8,
        systemProgram: 9,
        tokenProgram: 10,
        userWsolTokenAccount: 11,
    },
    unit,
)

export type AldrinSwap = undefined

export const aldrinSwap = instruction(
    {
        d8: '0xfbe877a6e1b9a9a1',
    },
    {
        swapProgram: 0,
        pool: 1,
        poolSigner: 2,
        poolMint: 3,
        baseTokenVault: 4,
        quoteTokenVault: 5,
        feePoolTokenAccount: 6,
        walletAuthority: 7,
        userBaseTokenAccount: 8,
        userQuoteTokenAccount: 9,
        tokenProgram: 10,
    },
    unit,
)

export type AldrinV2Swap = undefined

export const aldrinV2Swap = instruction(
    {
        d8: '0xbea6598b2198100a',
    },
    {
        swapProgram: 0,
        pool: 1,
        poolSigner: 2,
        poolMint: 3,
        baseTokenVault: 4,
        quoteTokenVault: 5,
        feePoolTokenAccount: 6,
        walletAuthority: 7,
        userBaseTokenAccount: 8,
        userQuoteTokenAccount: 9,
        curve: 10,
        tokenProgram: 11,
    },
    unit,
)

export type WhirlpoolSwap = undefined

export const whirlpoolSwap = instruction(
    {
        d8: '0x7be5b83f0c005c91',
    },
    {
        swapProgram: 0,
        tokenProgram: 1,
        tokenAuthority: 2,
        whirlpool: 3,
        tokenOwnerAccountA: 4,
        tokenVaultA: 5,
        tokenOwnerAccountB: 6,
        tokenVaultB: 7,
        tickArray0: 8,
        tickArray1: 9,
        tickArray2: 10,
        /**
         * Oracle is currently unused and will be enabled on subsequent updates
         */
        oracle: 11,
    },
    unit,
)

export type WhirlpoolSwapV2 = undefined

export const whirlpoolSwapV2 = instruction(
    {
        d8: '0x38a681099dcd76d9',
    },
    {
        swapProgram: 0,
        tokenProgramA: 1,
        tokenProgramB: 2,
        memoProgram: 3,
        tokenAuthority: 4,
        whirlpool: 5,
        tokenMintA: 6,
        tokenMintB: 7,
        tokenOwnerAccountA: 8,
        tokenVaultA: 9,
        tokenOwnerAccountB: 10,
        tokenVaultB: 11,
        tickArray0: 12,
        tickArray1: 13,
        tickArray2: 14,
        /**
         * Oracle is currently unused and will be enabled on subsequent updates
         */
        oracle: 15,
    },
    unit,
)

export type InvariantSwap = undefined

export const invariantSwap = instruction(
    {
        d8: '0xbbc128792f4990b1',
    },
    {
        swapProgram: 0,
        state: 1,
        pool: 2,
        tickmap: 3,
        accountX: 4,
        accountY: 5,
        reserveX: 6,
        reserveY: 7,
        owner: 8,
        programAuthority: 9,
        tokenProgram: 10,
    },
    unit,
)

export type MeteoraSwap = undefined

export const meteoraSwap = instruction(
    {
        d8: '0x7f7de20c5118cc23',
    },
    {
        swapProgram: 0,
        pool: 1,
        userSourceToken: 2,
        userDestinationToken: 3,
        aVault: 4,
        bVault: 5,
        aTokenVault: 6,
        bTokenVault: 7,
        aVaultLpMint: 8,
        bVaultLpMint: 9,
        aVaultLp: 10,
        bVaultLp: 11,
        adminTokenFee: 12,
        user: 13,
        vaultProgram: 14,
        tokenProgram: 15,
    },
    unit,
)

export type GoosefxSwap = undefined

export const goosefxSwap = instruction(
    {
        d8: '0xde882e7bbd7d7c7a',
    },
    {
        swapProgram: 0,
        controller: 1,
        pair: 2,
        sslIn: 3,
        sslOut: 4,
        liabilityVaultIn: 5,
        swappedLiabilityVaultIn: 6,
        liabilityVaultOut: 7,
        swappedLiabilityVaultOut: 8,
        userInAta: 9,
        userOutAta: 10,
        feeCollectorAta: 11,
        userWallet: 12,
        feeCollector: 13,
        tokenProgram: 14,
    },
    unit,
)

export type DeltafiSwap = undefined

export const deltafiSwap = instruction(
    {
        d8: '0x84e66678cd09edbe',
    },
    {
        swapProgram: 0,
        marketConfig: 1,
        swapInfo: 2,
        userSourceToken: 3,
        userDestinationToken: 4,
        swapSourceToken: 5,
        swapDestinationToken: 6,
        deltafiUser: 7,
        adminDestinationToken: 8,
        pythPriceBase: 9,
        pythPriceQuote: 10,
        userAuthority: 11,
        tokenProgram: 12,
    },
    unit,
)

export type BalansolSwap = undefined

export const balansolSwap = instruction(
    {
        d8: '0x896dfdfd466d0b64',
    },
    {
        swapProgram: 0,
        authority: 1,
        pool: 2,
        taxMan: 3,
        bidMint: 4,
        treasurer: 5,
        srcTreasury: 6,
        srcAssociatedTokenAccount: 7,
        askMint: 8,
        dstTreasury: 9,
        dstAssociatedTokenAccount: 10,
        dstTokenAccountTaxman: 11,
        systemProgram: 12,
        tokenProgram: 13,
        associatedTokenProgram: 14,
        rent: 15,
    },
    unit,
)

export type MarcoPoloSwap = undefined

export const marcoPoloSwap = instruction(
    {
        d8: '0xf1935e0f3a6cb344',
    },
    {
        swapProgram: 0,
        state: 1,
        pool: 2,
        tokenX: 3,
        tokenY: 4,
        poolXAccount: 5,
        poolYAccount: 6,
        swapperXAccount: 7,
        swapperYAccount: 8,
        swapper: 9,
        referrerXAccount: 10,
        referrerYAccount: 11,
        referrer: 12,
        programAuthority: 13,
        systemProgram: 14,
        tokenProgram: 15,
        associatedTokenProgram: 16,
        rent: 17,
    },
    unit,
)

export type DradexSwap = undefined

export const dradexSwap = instruction(
    {
        d8: '0x2292a02633553a97',
    },
    {
        swapProgram: 0,
        pair: 1,
        market: 2,
        eventQueue: 3,
        dexUser: 4,
        marketUser: 5,
        bids: 6,
        asks: 7,
        t0Vault: 8,
        t1Vault: 9,
        t0User: 10,
        t1User: 11,
        master: 12,
        signer: 13,
        systemProgram: 14,
        tokenProgram: 15,
        logger: 16,
    },
    unit,
)

export type LifinityV2Swap = undefined

export const lifinityV2Swap = instruction(
    {
        d8: '0x1398c3f5bb904ae3',
    },
    {
        swapProgram: 0,
        authority: 1,
        amm: 2,
        userTransferAuthority: 3,
        sourceInfo: 4,
        destinationInfo: 5,
        swapSource: 6,
        swapDestination: 7,
        poolMint: 8,
        feeAccount: 9,
        tokenProgram: 10,
        oracleMainAccount: 11,
        oracleSubAccount: 12,
        oraclePcAccount: 13,
    },
    unit,
)

export type RaydiumClmmSwap = undefined

export const raydiumClmmSwap = instruction(
    {
        d8: '0x2fb8d5c123d25704',
    },
    {
        swapProgram: 0,
        payer: 1,
        ammConfig: 2,
        poolState: 3,
        inputTokenAccount: 4,
        outputTokenAccount: 5,
        inputVault: 6,
        outputVault: 7,
        observationState: 8,
        tokenProgram: 9,
        tickArray: 10,
    },
    unit,
)

export type RaydiumClmmSwapV2 = undefined

export const raydiumClmmSwapV2 = instruction(
    {
        d8: '0x566cf65d582f725a',
    },
    {
        swapProgram: 0,
        payer: 1,
        ammConfig: 2,
        poolState: 3,
        inputTokenAccount: 4,
        outputTokenAccount: 5,
        inputVault: 6,
        outputVault: 7,
        observationState: 8,
        tokenProgram: 9,
        tokenProgram2022: 10,
        memoProgram: 11,
        inputVaultMint: 12,
        outputVaultMint: 13,
    },
    unit,
)

export type PhoenixSwap = undefined

export const phoenixSwap = instruction(
    {
        d8: '0x6342df5fec831a8c',
    },
    {
        swapProgram: 0,
        logAuthority: 1,
        market: 2,
        trader: 3,
        baseAccount: 4,
        quoteAccount: 5,
        baseVault: 6,
        quoteVault: 7,
        tokenProgram: 8,
    },
    unit,
)

export type SymmetrySwap = undefined

export const symmetrySwap = instruction(
    {
        d8: '0x1172edea9a0cb974',
    },
    {
        swapProgram: 0,
        buyer: 1,
        fundState: 2,
        pdaAccount: 3,
        pdaFromTokenAccount: 4,
        buyerFromTokenAccount: 5,
        pdaToTokenAccount: 6,
        buyerToTokenAccount: 7,
        swapFeeAccount: 8,
        hostFeeAccount: 9,
        managerFeeAccount: 10,
        tokenList: 11,
        prismData: 12,
        tokenProgram: 13,
    },
    unit,
)

export type HeliumTreasuryManagementRedeemV0 = undefined

export const heliumTreasuryManagementRedeemV0 = instruction(
    {
        d8: '0xa39fa319f3a16c4a',
    },
    {
        swapProgram: 0,
        treasuryManagement: 1,
        treasuryMint: 2,
        supplyMint: 3,
        treasury: 4,
        circuitBreaker: 5,
        from: 6,
        to: 7,
        owner: 8,
        circuitBreakerProgram: 9,
        tokenProgram: 10,
    },
    unit,
)

export type GoosefxV2Swap = undefined

export const goosefxV2Swap = instruction(
    {
        d8: '0xb26cd0899ac2a8d5',
    },
    {
        swapProgram: 0,
        pair: 1,
        poolRegistry: 2,
        userWallet: 3,
        sslPoolInSigner: 4,
        sslPoolOutSigner: 5,
        userAtaIn: 6,
        userAtaOut: 7,
        sslOutMainVault: 8,
        sslOutSecondaryVault: 9,
        sslInMainVault: 10,
        sslInSecondaryVault: 11,
        sslOutFeeVault: 12,
        feeDestination: 13,
        outputTokenPriceHistory: 14,
        outputTokenOracle: 15,
        inputTokenPriceHistory: 16,
        inputTokenOracle: 17,
        eventEmitter: 18,
        tokenProgram: 19,
    },
    unit,
)

export type PerpsSwap = undefined

export const perpsSwap = instruction(
    {
        d8: '0x93166cb26e12ab22',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingAccount: 2,
        receivingAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        receivingCustody: 7,
        receivingCustodyOracleAccount: 8,
        receivingCustodyTokenAccount: 9,
        dispensingCustody: 10,
        dispensingCustodyOracleAccount: 11,
        dispensingCustodyTokenAccount: 12,
        tokenProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    unit,
)

export type PerpsAddLiquidity = undefined

export const perpsAddLiquidity = instruction(
    {
        d8: '0xaaeeded6f5ca6c9b',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingOrReceivingAccount: 2,
        lpTokenAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        custody: 7,
        custodyOracleAccount: 8,
        custodyTokenAccount: 9,
        lpTokenMint: 10,
        tokenProgram: 11,
        eventAuthority: 12,
        program: 13,
    },
    unit,
)

export type PerpsRemoveLiquidity = undefined

export const perpsRemoveLiquidity = instruction(
    {
        d8: '0x4fd3e88c084edc22',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingOrReceivingAccount: 2,
        lpTokenAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        custody: 7,
        custodyOracleAccount: 8,
        custodyTokenAccount: 9,
        lpTokenMint: 10,
        tokenProgram: 11,
        eventAuthority: 12,
        program: 13,
    },
    unit,
)

export type MeteoraDlmmSwap = undefined

export const meteoraDlmmSwap = instruction(
    {
        d8: '0x7f40258aadf3cf54',
    },
    {
        swapProgram: 0,
        lbPair: 1,
        binArrayBitmapExtension: 2,
        reserveX: 3,
        reserveY: 4,
        userTokenIn: 5,
        userTokenOut: 6,
        tokenXMint: 7,
        tokenYMint: 8,
        oracle: 9,
        hostFeeIn: 10,
        user: 11,
        tokenXProgram: 12,
        tokenYProgram: 13,
        eventAuthority: 14,
        program: 15,
    },
    unit,
)

export type OpenBookV2Swap = undefined

export const openBookV2Swap = instruction(
    {
        d8: '0x871aa32bc6dd1d43',
    },
    {
        swapProgram: 0,
        signer: 1,
        penaltyPayer: 2,
        market: 3,
        marketAuthority: 4,
        bids: 5,
        asks: 6,
        marketBaseVault: 7,
        marketQuoteVault: 8,
        eventHeap: 9,
        userBaseAccount: 10,
        userQuoteAccount: 11,
        oracleA: 12,
        oracleB: 13,
        tokenProgram: 14,
        systemProgram: 15,
        openOrdersAdmin: 16,
    },
    unit,
)

export type CloneSwap = undefined

export const cloneSwap = instruction(
    {
        d8: '0x55c99a5c851f8e55',
    },
    {
        swapProgram: 0,
        user: 1,
        clone: 2,
        pools: 3,
        oracles: 4,
        userCollateralTokenAccount: 5,
        userOnassetTokenAccount: 6,
        onassetMint: 7,
        collateralMint: 8,
        collateralVault: 9,
        treasuryOnassetTokenAccount: 10,
        treasuryCollateralTokenAccount: 11,
        tokenProgram: 12,
        cloneStaking: 13,
        userStakingAccount: 14,
        cloneStakingProgram: 15,
    },
    unit,
)

export type RaydiumCpSwap = undefined

export const raydiumCpSwap = instruction(
    {
        d8: '0x36ea538d34bf2e90',
    },
    {
        swapProgram: 0,
        payer: 1,
        authority: 2,
        ammConfig: 3,
        poolState: 4,
        inputTokenAccount: 5,
        outputTokenAccount: 6,
        inputVault: 7,
        outputVault: 8,
        inputTokenProgram: 9,
        outputTokenProgram: 10,
        inputTokenMint: 11,
        outputTokenMint: 12,
        observationState: 13,
    },
    unit,
)

export type OneIntroSwap = undefined

export const oneIntroSwap = instruction(
    {
        d8: '0xd0d450a92494d123',
    },
    {
        swapProgram: 0,
        metadataState: 1,
        poolState: 2,
        poolAuthPda: 3,
        poolTokenInAccount: 4,
        poolTokenOutAccount: 5,
        user: 6,
        userTokenInAccount: 7,
        userTokenOutAccount: 8,
        metadataSwapFeeAccount: 9,
        referralTokenAccount: 10,
        tokenProgram: 11,
    },
    unit,
)

export type PumpdotfunWrappedBuy = undefined

export const pumpdotfunWrappedBuy = instruction(
    {
        d8: '0x8a8ba786d05b8a9e',
    },
    {
        swapProgram: 0,
        global: 1,
        feeRecipient: 2,
        mint: 3,
        bondingCurve: 4,
        associatedBondingCurve: 5,
        associatedUser: 6,
        user: 7,
        systemProgram: 8,
        tokenProgram: 9,
        rent: 10,
        eventAuthority: 11,
        program: 12,
        userWsolTokenAccount: 13,
        tempWsolTokenAccount: 14,
        wsolMint: 15,
    },
    unit,
)

export type PumpdotfunWrappedSell = undefined

export const pumpdotfunWrappedSell = instruction(
    {
        d8: '0xff136363284153ff',
    },
    {
        swapProgram: 0,
        global: 1,
        feeRecipient: 2,
        mint: 3,
        bondingCurve: 4,
        associatedBondingCurve: 5,
        associatedUser: 6,
        user: 7,
        systemProgram: 8,
        associatedTokenProgram: 9,
        tokenProgram: 10,
        eventAuthority: 11,
        program: 12,
        userWsolTokenAccount: 13,
    },
    unit,
)

export type PerpsV2Swap = undefined

export const perpsV2Swap = instruction(
    {
        d8: '0x7ff5139e52fa2112',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingAccount: 2,
        receivingAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        receivingCustody: 7,
        receivingCustodyDovesPriceAccount: 8,
        receivingCustodyPythnetPriceAccount: 9,
        receivingCustodyTokenAccount: 10,
        dispensingCustody: 11,
        dispensingCustodyDovesPriceAccount: 12,
        dispensingCustodyPythnetPriceAccount: 13,
        dispensingCustodyTokenAccount: 14,
        tokenProgram: 15,
        eventAuthority: 16,
        program: 17,
    },
    unit,
)

export type PerpsV2AddLiquidity = undefined

export const perpsV2AddLiquidity = instruction(
    {
        d8: '0x124258c2c53474d4',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingOrReceivingAccount: 2,
        lpTokenAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
        custodyTokenAccount: 10,
        lpTokenMint: 11,
        tokenProgram: 12,
        eventAuthority: 13,
        program: 14,
    },
    unit,
)

export type PerpsV2RemoveLiquidity = undefined

export const perpsV2RemoveLiquidity = instruction(
    {
        d8: '0x106762636a240569',
    },
    {
        swapProgram: 0,
        owner: 1,
        fundingOrReceivingAccount: 2,
        lpTokenAccount: 3,
        transferAuthority: 4,
        perpetuals: 5,
        pool: 6,
        custody: 7,
        custodyDovesPriceAccount: 8,
        custodyPythnetPriceAccount: 9,
        custodyTokenAccount: 10,
        lpTokenMint: 11,
        tokenProgram: 12,
        eventAuthority: 13,
        program: 14,
    },
    unit,
)

export type MoonshotWrappedBuy = undefined

export const moonshotWrappedBuy = instruction(
    {
        d8: '0xcf96d59c8a68ee8e',
    },
    {
        swapProgram: 0,
        sender: 1,
        senderTokenAccount: 2,
        curveAccount: 3,
        curveTokenAccount: 4,
        dexFee: 5,
        helioFee: 6,
        mint: 7,
        configAccount: 8,
        tokenProgram: 9,
        associatedTokenProgram: 10,
        systemProgram: 11,
        userWsolTokenAccount: 12,
        tempWsolTokenAccount: 13,
        wsolMint: 14,
    },
    unit,
)

export type MoonshotWrappedSell = undefined

export const moonshotWrappedSell = instruction(
    {
        d8: '0xf802f0fd11b83908',
    },
    {
        swapProgram: 0,
        sender: 1,
        senderTokenAccount: 2,
        curveAccount: 3,
        curveTokenAccount: 4,
        dexFee: 5,
        helioFee: 6,
        mint: 7,
        configAccount: 8,
        tokenProgram: 9,
        associatedTokenProgram: 10,
        systemProgram: 11,
        userWsolTokenAccount: 12,
    },
    unit,
)

export type StabbleStableSwap = undefined

export const stabbleStableSwap = instruction(
    {
        d8: '0x9049a3948f222890',
    },
    {
        swapProgram: 0,
        user: 1,
        userTokenIn: 2,
        userTokenOut: 3,
        vaultTokenIn: 4,
        vaultTokenOut: 5,
        beneficiaryTokenOut: 6,
        pool: 7,
        withdrawAuthority: 8,
        vault: 9,
        vaultAuthority: 10,
        vaultProgram: 11,
        tokenProgram: 12,
    },
    unit,
)

export type StabbleWeightedSwap = undefined

export const stabbleWeightedSwap = instruction(
    {
        d8: '0x5ed6e86f8e3d7b1d',
    },
    {
        swapProgram: 0,
        user: 1,
        userTokenIn: 2,
        userTokenOut: 3,
        vaultTokenIn: 4,
        vaultTokenOut: 5,
        beneficiaryTokenOut: 6,
        pool: 7,
        withdrawAuthority: 8,
        vault: 9,
        vaultAuthority: 10,
        vaultProgram: 11,
        tokenProgram: 12,
    },
    unit,
)

export type ObricSwap = undefined

export const obricSwap = instruction(
    {
        d8: '0x415d60a9bed65f03',
    },
    {
        swapProgram: 0,
        tradingPair: 1,
        mintX: 2,
        mintY: 3,
        reserveX: 4,
        reserveY: 5,
        userTokenAccountX: 6,
        userTokenAccountY: 7,
        protocolFee: 8,
        xPriceFeed: 9,
        yPriceFeed: 10,
        user: 11,
        tokenProgram: 12,
    },
    unit,
)

export type FoxBuyFromEstimatedCost = undefined

export const foxBuyFromEstimatedCost = instruction(
    {
        d8: '0x26143e26fcfeb4d8',
    },
    {
        swapProgram: 0,
        user: 1,
        config: 2,
        mintBase: 3,
        mintY: 4,
        mintN: 5,
        pot: 6,
        userAtaBase: 7,
        userAtaBuy: 8,
        tokenProgram: 9,
    },
    unit,
)

export type FoxClaimPartial = undefined

export const foxClaimPartial = instruction(
    {
        d8: '0xb8b07df48ba8fe81',
    },
    {
        swapProgram: 0,
        user: 1,
        config: 2,
        mintBase: 3,
        mintY: 4,
        mintN: 5,
        pot: 6,
        userAtaBase: 7,
        userAtaY: 8,
        userAtaN: 9,
        tokenProgram: 10,
    },
    unit,
)

export type SolFiSwap = undefined

export const solFiSwap = instruction(
    {
        d8: '0xbb1224cf4d34192b',
    },
    {
        swapProgram: 0,
        tokenTransferAuthority: 1,
        marketAccount: 2,
        baseVault: 3,
        quoteVault: 4,
        userBaseAta: 5,
        userQuoteAta: 6,
        tokenProgram: 7,
        instructionsSysvar: 8,
    },
    unit,
)

export type SolayerDelegateUndelegateNoInit = undefined

export const solayerDelegateUndelegateNoInit = instruction(
    {
        d8: '0xc5692e02fd08c524',
    },
    {
        swapProgram: 0,
        staker: 1,
        endoAvs: 2,
        avsTokenMint: 3,
        delegatedTokenVault: 4,
        delegatedTokenMint: 5,
        stakerDelegatedTokenAccount: 6,
        stakerAvsTokenAccount: 7,
        tokenProgram: 8,
    },
    unit,
)
