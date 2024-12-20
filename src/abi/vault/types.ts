import {Codec, struct, u8, fixedArray, u64, unit, sum, ref, address} from '@subsquid/borsh'

export interface VaultBumps {
    /**
     * vault_bump
     */
    vaultBump: number
    /**
     * token_vault_bump
     */
    tokenVaultBump: number
}

export const VaultBumps: Codec<VaultBumps> = struct({
    /**
     * vault_bump
     */
    vaultBump: u8,
    /**
     * token_vault_bump
     */
    tokenVaultBump: u8,
})

export interface StrategyBumps {
    /**
     * strategy_index
     */
    strategyIndex: number
    /**
     * Bumps of PDAs for the integrated protocol.
     */
    otherBumps: Array<number>
}

export const StrategyBumps: Codec<StrategyBumps> = struct({
    /**
     * strategy_index
     */
    strategyIndex: u8,
    /**
     * Bumps of PDAs for the integrated protocol.
     */
    otherBumps: fixedArray(u8, 10),
})

export interface LockedProfitTracker {
    /**
     * The total locked profit from the last report
     */
    lastUpdatedLockedProfit: bigint
    /**
     * The last timestamp (in seconds) rebalancing
     */
    lastReport: bigint
    /**
     * Rate per second of degradation
     */
    lockedProfitDegradation: bigint
}

export const LockedProfitTracker: Codec<LockedProfitTracker> = struct({
    /**
     * The total locked profit from the last report
     */
    lastUpdatedLockedProfit: u64,
    /**
     * The last timestamp (in seconds) rebalancing
     */
    lastReport: u64,
    /**
     * Rate per second of degradation
     */
    lockedProfitDegradation: u64,
})

export type StrategyType_PortFinanceWithoutLM = undefined

export const StrategyType_PortFinanceWithoutLM = unit

export type StrategyType_PortFinanceWithLM = undefined

export const StrategyType_PortFinanceWithLM = unit

export type StrategyType_SolendWithoutLM = undefined

export const StrategyType_SolendWithoutLM = unit

export type StrategyType_Mango = undefined

export const StrategyType_Mango = unit

export type StrategyType_SolendWithLM = undefined

export const StrategyType_SolendWithLM = unit

export type StrategyType_ApricotWithoutLM = undefined

export const StrategyType_ApricotWithoutLM = unit

export type StrategyType_Francium = undefined

export const StrategyType_Francium = unit

export type StrategyType_Tulip = undefined

export const StrategyType_Tulip = unit

export type StrategyType_Vault = undefined

export const StrategyType_Vault = unit

export type StrategyType_Drift = undefined

export const StrategyType_Drift = unit

export type StrategyType_Frakt = undefined

export const StrategyType_Frakt = unit

export type StrategyType_Marginfi = undefined

export const StrategyType_Marginfi = unit

export type StrategyType = 
    | {
        kind: 'PortFinanceWithoutLM'
        value?: StrategyType_PortFinanceWithoutLM
      }
    | {
        kind: 'PortFinanceWithLM'
        value?: StrategyType_PortFinanceWithLM
      }
    | {
        kind: 'SolendWithoutLM'
        value?: StrategyType_SolendWithoutLM
      }
    | {
        kind: 'Mango'
        value?: StrategyType_Mango
      }
    | {
        kind: 'SolendWithLM'
        value?: StrategyType_SolendWithLM
      }
    | {
        kind: 'ApricotWithoutLM'
        value?: StrategyType_ApricotWithoutLM
      }
    | {
        kind: 'Francium'
        value?: StrategyType_Francium
      }
    | {
        kind: 'Tulip'
        value?: StrategyType_Tulip
      }
    | {
        kind: 'Vault'
        value?: StrategyType_Vault
      }
    | {
        kind: 'Drift'
        value?: StrategyType_Drift
      }
    | {
        kind: 'Frakt'
        value?: StrategyType_Frakt
      }
    | {
        kind: 'Marginfi'
        value?: StrategyType_Marginfi
      }

export const StrategyType: Codec<StrategyType> = sum(1, {
    PortFinanceWithoutLM: {
        discriminator: 0,
        value: StrategyType_PortFinanceWithoutLM,
    },
    PortFinanceWithLM: {
        discriminator: 1,
        value: StrategyType_PortFinanceWithLM,
    },
    SolendWithoutLM: {
        discriminator: 2,
        value: StrategyType_SolendWithoutLM,
    },
    Mango: {
        discriminator: 3,
        value: StrategyType_Mango,
    },
    SolendWithLM: {
        discriminator: 4,
        value: StrategyType_SolendWithLM,
    },
    ApricotWithoutLM: {
        discriminator: 5,
        value: StrategyType_ApricotWithoutLM,
    },
    Francium: {
        discriminator: 6,
        value: StrategyType_Francium,
    },
    Tulip: {
        discriminator: 7,
        value: StrategyType_Tulip,
    },
    Vault: {
        discriminator: 8,
        value: StrategyType_Vault,
    },
    Drift: {
        discriminator: 9,
        value: StrategyType_Drift,
    },
    Frakt: {
        discriminator: 10,
        value: StrategyType_Frakt,
    },
    Marginfi: {
        discriminator: 11,
        value: StrategyType_Marginfi,
    },
})

export interface Vault {
    /**
     * The flag, if admin set enable = false, then the user can only withdraw and cannot deposit in the vault.
     */
    enabled: number
    /**
     * Vault nonce, to create vault seeds
     */
    bumps: VaultBumps
    /**
     * The total liquidity of the vault, including remaining tokens in token_vault and the liquidity in all strategies.
     */
    totalAmount: bigint
    /**
     * Token account, hold liquidity in vault reserve
     */
    tokenVault: string
    /**
     * Hold lp token of vault, each time rebalance crank is called, vault calculate performance fee and mint corresponding lp token amount to fee_vault. fee_vault is owned by treasury address
     */
    feeVault: string
    /**
     * Token mint that vault supports
     */
    tokenMint: string
    /**
     * Lp mint of vault
     */
    lpMint: string
    /**
     * The list of strategy addresses that vault supports, vault can support up to MAX_STRATEGY strategies at the same time.
     */
    strategies: Array<string>
    /**
     * The base address to create vault seeds
     */
    base: string
    /**
     * Admin of vault
     */
    admin: string
    /**
     * Person who can send the crank. Operator can only send liquidity to strategies that admin defined, and claim reward to account of treasury address
     */
    operator: string
    /**
     * Stores information for locked profit.
     */
    lockedProfitTracker: LockedProfitTracker
}

export const Vault: Codec<Vault> = struct({
    /**
     * The flag, if admin set enable = false, then the user can only withdraw and cannot deposit in the vault.
     */
    enabled: u8,
    /**
     * Vault nonce, to create vault seeds
     */
    bumps: ref(() => VaultBumps),
    /**
     * The total liquidity of the vault, including remaining tokens in token_vault and the liquidity in all strategies.
     */
    totalAmount: u64,
    /**
     * Token account, hold liquidity in vault reserve
     */
    tokenVault: address,
    /**
     * Hold lp token of vault, each time rebalance crank is called, vault calculate performance fee and mint corresponding lp token amount to fee_vault. fee_vault is owned by treasury address
     */
    feeVault: address,
    /**
     * Token mint that vault supports
     */
    tokenMint: address,
    /**
     * Lp mint of vault
     */
    lpMint: address,
    /**
     * The list of strategy addresses that vault supports, vault can support up to MAX_STRATEGY strategies at the same time.
     */
    strategies: fixedArray(address, 30),
    /**
     * The base address to create vault seeds
     */
    base: address,
    /**
     * Admin of vault
     */
    admin: address,
    /**
     * Person who can send the crank. Operator can only send liquidity to strategies that admin defined, and claim reward to account of treasury address
     */
    operator: address,
    /**
     * Stores information for locked profit.
     */
    lockedProfitTracker: ref(() => LockedProfitTracker),
})

export interface Strategy {
    /**
     * Lending pool address, that the strategy will deposit/withdraw balance
     */
    reserve: string
    /**
     * The token account, that holds the collateral token
     */
    collateralVault: string
    /**
     * Specify type of strategy
     */
    strategyType: StrategyType
    /**
     * The liquidity in strategy at the time vault deposit/withdraw from a lending protocol
     */
    currentLiquidity: bigint
    /**
     * Hold some bumps, in case the strategy needs to use other seeds to sign a CPI call.
     */
    bumps: Array<number>
    /**
     * Vault address, that the strategy belongs
     */
    vault: string
    /**
     * If we remove strategy by remove_strategy2 endpoint, this account will be never added again
     */
    isDisable: number
}

export const Strategy: Codec<Strategy> = struct({
    /**
     * Lending pool address, that the strategy will deposit/withdraw balance
     */
    reserve: address,
    /**
     * The token account, that holds the collateral token
     */
    collateralVault: address,
    /**
     * Specify type of strategy
     */
    strategyType: ref(() => StrategyType),
    /**
     * The liquidity in strategy at the time vault deposit/withdraw from a lending protocol
     */
    currentLiquidity: u64,
    /**
     * Hold some bumps, in case the strategy needs to use other seeds to sign a CPI call.
     */
    bumps: fixedArray(u8, 10),
    /**
     * Vault address, that the strategy belongs
     */
    vault: address,
    /**
     * If we remove strategy by remove_strategy2 endpoint, this account will be never added again
     */
    isDisable: u8,
})

export interface AddLiquidity {
    lpMintAmount: bigint
    tokenAmount: bigint
}

export const AddLiquidity: Codec<AddLiquidity> = struct({
    lpMintAmount: u64,
    tokenAmount: u64,
})

export interface RemoveLiquidity {
    lpUnmintAmount: bigint
    tokenAmount: bigint
}

export const RemoveLiquidity: Codec<RemoveLiquidity> = struct({
    lpUnmintAmount: u64,
    tokenAmount: u64,
})

export interface StrategyDeposit {
    strategyType: StrategyType
    tokenAmount: bigint
}

export const StrategyDeposit: Codec<StrategyDeposit> = struct({
    strategyType: ref(() => StrategyType),
    tokenAmount: u64,
})

export interface StrategyWithdraw {
    strategyType: StrategyType
    collateralAmount: bigint
    estimatedTokenAmount: bigint
}

export const StrategyWithdraw: Codec<StrategyWithdraw> = struct({
    strategyType: ref(() => StrategyType),
    collateralAmount: u64,
    estimatedTokenAmount: u64,
})

export interface ClaimReward {
    strategyType: StrategyType
    tokenAmount: bigint
    mintAccount: string
}

export const ClaimReward: Codec<ClaimReward> = struct({
    strategyType: ref(() => StrategyType),
    tokenAmount: u64,
    mintAccount: address,
})

export interface PerformanceFee {
    lpMintMore: bigint
}

export const PerformanceFee: Codec<PerformanceFee> = struct({
    lpMintMore: u64,
})

export interface ReportLoss {
    strategy: string
    loss: bigint
}

export const ReportLoss: Codec<ReportLoss> = struct({
    strategy: address,
    loss: u64,
})

export interface TotalAmount {
    totalAmount: bigint
}

export const TotalAmount: Codec<TotalAmount> = struct({
    totalAmount: u64,
})
