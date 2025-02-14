import { PublicKey } from "@solana/web3.js";

export interface SwapAccounts {
    lbPair: string
    binArrayBitmapExtension: string
    reserveX: string
    reserveY: string
    userTokenIn: string
    userTokenOut: string
    tokenXMint: string
    tokenYMint: string
    oracle: string
    hostFeeIn: string
    user: string
    tokenXProgram: string
    tokenYProgram: string
    eventAuthority: string
    program: string
}

export interface SwapData {
    amountIn: bigint
    minAmountOut: bigint
    maxPriceImpactBps?: number
}

export interface AddLiquidityAccounts {
    lbPair: string
    binArrayBitmapExtension: string
    tokenMintX: string
    tokenMintY: string
    reserveX: string
    reserveY: string
    userTokenX: string
    userTokenY: string
    position: string
    user: string
    eventAuthority: string
    program: string
}

export interface AddLiquidityData {
    liquidity: bigint
    lowerBinId: number
    upperBinId: number
    operator?: string
    feeOwner?: string
    lockReleasePoint?: number
}

export interface RemoveLiquidityAccounts {
    lbPair: string
    binArrayBitmapExtension: string
    tokenMintX: string
    tokenMintY: string
    reserveX: string
    reserveY: string
    userTokenX: string
    userTokenY: string
    position: string
    user: string
    eventAuthority: string
    program: string
}

export interface RemoveLiquidityData {
    liquidity: bigint
    lowerBinId: number
    upperBinId: number
}

export interface InitializePoolAccounts {
    lbPair: string
    binArrayBitmapExtension: string
    tokenMintX: string
    tokenMintY: string
    reserveX: string
    reserveY: string
    oracle: string
    presetParameter: string
    funder: string
    tokenProgram: string
    systemProgram: string
    rent: string
    eventAuthority: string
    program: string
}

export interface InitializePoolData {
    activeId: number
    binStep: number
}

export interface InitializeRewardAccounts {
    lbPair: string
    rewardVault: string
    funder: string
    eventAuthority: string
    program: string
}

export interface FundRewardAccounts {
    lbPair: string
    rewardVault: string
    funder: string
    eventAuthority: string
    program: string
}

export interface ClaimRewardAccounts {
    lbPair: string
    position: string
    sender: string
    rewardVault: string
}

export interface ClaimFeeAccounts {
    lbPair: string
    position: string
    sender: string
    reserveX: string
    reserveY: string
    userTokenX: string
    userTokenY: string
}
