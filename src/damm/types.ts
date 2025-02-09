import { CurveType } from '../abi/damm/types'

// Base interface for common accounts
interface BaseAccounts {
    pool: string
    lpMint?: string
    tokenProgram: string
    vaultProgram: string
    user: string
}

// Base interface for vault-related accounts
interface VaultAccounts extends BaseAccounts {
    aVault: string
    bVault: string
    aVaultLpMint: string
    bVaultLpMint: string
    aTokenVault: string
    bTokenVault: string
}

export interface SwapAccounts extends VaultAccounts {
    userSourceToken: string
    userDestinationToken: string
    aVaultLp: string
    bVaultLp: string
    protocolTokenFee: string
}

export interface SwapData {
    inAmount: bigint
    minimumOutAmount: bigint
}

export interface AddBalanceLiquidityAccounts extends VaultAccounts {
    userPoolLp: string
    aVaultLp: string
    bVaultLp: string
    userAToken: string
    userBToken: string
}

export interface AddBalanceLiquidityData {
    poolTokenAmount: bigint
    maximumTokenAAmount: bigint
    maximumTokenBAmount: bigint
}

export interface RemoveBalanceLiquidityAccounts extends VaultAccounts {
    userPoolLp: string
    aVaultLp: string
    bVaultLp: string
    userAToken: string
    userBToken: string
}

export interface RemoveBalanceLiquidityData {
    poolTokenAmount: bigint
    minimumATokenOut: bigint
    minimumBTokenOut: bigint
}

export interface AddImbalanceLiquidityAccounts extends VaultAccounts {
    userPoolLp: string
    aVaultLp: string
    bVaultLp: string
    userAToken: string
    userBToken: string
}

export interface AddImbalanceLiquidityData {
    minimumPoolTokenAmount: bigint
    tokenAAmount: bigint
    tokenBAmount: bigint
}

export interface RemoveLiquiditySingleSideAccounts extends VaultAccounts {
    userPoolLp: string
    aVaultLp: string
    bVaultLp: string
    userDestinationToken: string
}

export interface RemoveLiquiditySingleSideData {
    poolTokenAmount: bigint
    minimumOutAmount: bigint
}

export interface InitializePoolAccounts extends BaseAccounts {
    tokenAMint: string
    tokenBMint: string
    aVault: string
    bVault: string
    aVaultLpMint: string
    bVaultLpMint: string
    aTokenVault: string
    bTokenVault: string
}

export interface InitializePoolData {
    curveType?: CurveType
    tokenAAmount: bigint
    tokenBAmount: bigint
    tradeFeeBps?: bigint
    activationPoint?: bigint
}

export interface EnableOrDisablePoolAccounts extends BaseAccounts {
    admin: string
}

export interface EnableOrDisablePoolData {
    enable: boolean
}

export interface OverrideCurveParamAccounts extends BaseAccounts {
    admin: string
}

export interface OverrideCurveParamData {
    curveType: CurveType
}

export interface BootstrapLiquidityAccounts extends VaultAccounts {
    userAToken: string
    userBToken: string
    userPoolLp: string
    admin: string
}

export interface BootstrapLiquidityData {
    tokenAAmount: bigint
    tokenBAmount: bigint
}

export interface ClaimFeeAccounts {
    pool: string
    lpMint: string
    lockEscrow: string
    owner: string
    sourceTokens: string
    escrowVault: string
    aTokenVault: string
    bTokenVault: string
    aVault: string
    bVault: string
    aVaultLp: string
    bVaultLp: string
    aVaultLpMint: string
    bVaultLpMint: string
    userAToken: string
    userBToken: string
    vaultProgram: string
}

export interface ClaimFeeData {
    maxAmount: bigint
}
