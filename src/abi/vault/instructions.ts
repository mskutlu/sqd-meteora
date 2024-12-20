import {unit, struct, u8, u64} from '@subsquid/borsh'
import {instruction} from '../abi.support'
import {StrategyBumps, StrategyType} from './types'

/**
 * initialize new vault
 */
export type Initialize = undefined

/**
 * initialize new vault
 */
export const initialize = instruction(
    {
        d8: '0xafaf6d1f0d989bed',
    },
    {
        /**
         * This is base account for all vault
         * No need base key now because we only allow 1 vault per token now
         * Vault account
         */
        vault: 0,
        /**
         * Payer can be anyone
         */
        payer: 1,
        /**
         * Token vault account
         */
        tokenVault: 2,
        /**
         * Token mint account
         */
        tokenMint: 3,
        lpMint: 4,
        /**
         * rent
         */
        rent: 5,
        /**
         * token_program
         */
        tokenProgram: 6,
        /**
         * system_program
         */
        systemProgram: 7,
    },
    unit,
)

/**
 * enable vault
 */
export interface EnableVault {
    enabled: number
}

/**
 * enable vault
 */
export const enableVault = instruction(
    {
        d8: '0x9152f19c1a9ae9d3',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        /**
         * Admin account
         */
        admin: 1,
    },
    struct({
        enabled: u8,
    }),
)

/**
 * set new operator
 */
export type SetOperator = undefined

/**
 * set new operator
 */
export const setOperator = instruction(
    {
        d8: '0xee9965a9f3832401',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        operator: 1,
        /**
         * admin
         */
        admin: 2,
    },
    unit,
)

/**
 * Initialize a strategy and add strategy to vault.strategies index
 */
export interface InitializeStrategy {
    bumps: StrategyBumps
    strategyType: StrategyType
}

/**
 * Initialize a strategy and add strategy to vault.strategies index
 */
export const initializeStrategy = instruction(
    {
        d8: '0xd0779091b23969fc',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        strategyProgram: 1,
        /**
         * Strategy account
         */
        strategy: 2,
        reserve: 3,
        /**
         * Collateral vault account
         */
        collateralVault: 4,
        /**
         * Collateral mint account
         */
        collateralMint: 5,
        /**
         * Admin account
         */
        admin: 6,
        /**
         * System program account
         */
        systemProgram: 7,
        /**
         * Rent account
         */
        rent: 8,
        /**
         * Token program account
         */
        tokenProgram: 9,
    },
    struct({
        bumps: StrategyBumps,
        strategyType: StrategyType,
    }),
)

/**
 * remove a strategy
 */
export type RemoveStrategy = undefined

/**
 * remove a strategy
 */
export const removeStrategy = instruction(
    {
        d8: '0xb9ee215b86d2611a',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        /**
         * Strategy account
         */
        strategy: 1,
        strategyProgram: 2,
        /**
         * Collateral vault account
         */
        collateralVault: 3,
        reserve: 4,
        /**
         * token_vault
         */
        tokenVault: 5,
        /**
         * fee_vault
         */
        feeVault: 6,
        /**
         * lp_mint
         */
        lpMint: 7,
        /**
         * token_program
         */
        tokenProgram: 8,
        /**
         * admin
         */
        admin: 9,
    },
    unit,
)

/**
 * remove a strategy by advance payment
 */
export interface RemoveStrategy2 {
    maxAdminPayAmount: bigint
}

/**
 * remove a strategy by advance payment
 */
export const removeStrategy2 = instruction(
    {
        d8: '0x8a68d0947e23c30e',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        /**
         * Strategy account
         */
        strategy: 1,
        strategyProgram: 2,
        /**
         * Collateral vault account
         */
        collateralVault: 3,
        reserve: 4,
        /**
         * token_vault
         */
        tokenVault: 5,
        /**
         * token_advance_payemnt
         * the owner of token_advance_payment must be admin
         */
        tokenAdminAdvancePayment: 6,
        /**
         * token_vault_advance_payment
         * the account must be different from token_vault
         * the owner of token_advance_payment must be vault
         */
        tokenVaultAdvancePayment: 7,
        /**
         * fee_vault
         */
        feeVault: 8,
        /**
         * lp_mint
         */
        lpMint: 9,
        /**
         * token_program
         */
        tokenProgram: 10,
        /**
         * admin
         */
        admin: 11,
    },
    struct({
        maxAdminPayAmount: u64,
    }),
)

/**
 * collect token, that someone send wrongly
 * also help in case Mango reimbursement
 */
export type CollectDust = undefined

/**
 * collect token, that someone send wrongly
 * also help in case Mango reimbursement
 */
export const collectDust = instruction(
    {
        d8: '0xf6951552a04afef0',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * Token vault, must be different from vault.token_vault
         */
        tokenVault: 1,
        /**
         * token admin, enforce owner is admin to avoid mistake
         */
        tokenAdmin: 2,
        /**
         * admin
         */
        admin: 3,
        /**
         * token_program
         */
        tokenProgram: 4,
    },
    unit,
)

/**
 * add a strategy
 */
export type AddStrategy = undefined

/**
 * add a strategy
 */
export const addStrategy = instruction(
    {
        d8: '0x407b7fe3c0eac614',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * strategy
         */
        strategy: 1,
        /**
         * admin
         */
        admin: 2,
    },
    unit,
)

/**
 * deposit liquidity to a strategy
 */
export interface DepositStrategy {
    amount: bigint
}

/**
 * deposit liquidity to a strategy
 */
export const depositStrategy = instruction(
    {
        d8: '0xf65239e283defdf9',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * strategy
         */
        strategy: 1,
        /**
         * token_vault
         */
        tokenVault: 2,
        /**
         * fee_vault
         */
        feeVault: 3,
        /**
         * lp_mint
         */
        lpMint: 4,
        strategyProgram: 5,
        /**
         * collateral_vault
         */
        collateralVault: 6,
        reserve: 7,
        /**
         * token_program
         */
        tokenProgram: 8,
        /**
         * operator
         */
        operator: 9,
    },
    struct({
        amount: u64,
    }),
)

/**
 * withdraw liquidity from a strategy
 */
export interface WithdrawStrategy {
    amount: bigint
}

/**
 * withdraw liquidity from a strategy
 */
export const withdrawStrategy = instruction(
    {
        d8: '0x1f2da205c1d986bc',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * strategy
         */
        strategy: 1,
        /**
         * token_vault
         */
        tokenVault: 2,
        /**
         * fee_vault
         */
        feeVault: 3,
        /**
         * lp_mint
         */
        lpMint: 4,
        strategyProgram: 5,
        /**
         * collateral_vault
         */
        collateralVault: 6,
        reserve: 7,
        /**
         * token_program
         */
        tokenProgram: 8,
        /**
         * operator
         */
        operator: 9,
    },
    struct({
        amount: u64,
    }),
)

/**
 * Withdraw v2. Withdraw from token vault if no remaining accounts are available. Else, it will attempt to withdraw from strategy and token vault. This method just proxy between 2 methods. Protocol integration should be using withdraw instead of this function.
 */
export interface Withdraw2 {
    unmintAmount: bigint
    minOutAmount: bigint
}

/**
 * Withdraw v2. Withdraw from token vault if no remaining accounts are available. Else, it will attempt to withdraw from strategy and token vault. This method just proxy between 2 methods. Protocol integration should be using withdraw instead of this function.
 */
export const withdraw2 = instruction(
    {
        d8: '0x50066f49aed34284',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * token_vault
         */
        tokenVault: 1,
        /**
         * lp_mint
         */
        lpMint: 2,
        /**
         * user_token
         */
        userToken: 3,
        /**
         * user_lp
         */
        userLp: 4,
        /**
         * user
         */
        user: 5,
        /**
         * token_program
         */
        tokenProgram: 6,
    },
    struct({
        unmintAmount: u64,
        minOutAmount: u64,
    }),
)

/**
 * user deposit liquidity to vault
 */
export interface Deposit {
    tokenAmount: bigint
    minimumLpTokenAmount: bigint
}

/**
 * user deposit liquidity to vault
 */
export const deposit = instruction(
    {
        d8: '0xf223c68952e1f2b6',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * token_vault
         */
        tokenVault: 1,
        /**
         * lp_mint
         */
        lpMint: 2,
        /**
         * user_token
         */
        userToken: 3,
        /**
         * user_lp
         */
        userLp: 4,
        /**
         * user
         */
        user: 5,
        /**
         * token_program
         */
        tokenProgram: 6,
    },
    struct({
        tokenAmount: u64,
        minimumLpTokenAmount: u64,
    }),
)

/**
 * user withdraw liquidity from vault
 */
export interface Withdraw {
    unmintAmount: bigint
    minOutAmount: bigint
}

/**
 * user withdraw liquidity from vault
 */
export const withdraw = instruction(
    {
        d8: '0xb712469c946da122',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * token_vault
         */
        tokenVault: 1,
        /**
         * lp_mint
         */
        lpMint: 2,
        /**
         * user_token
         */
        userToken: 3,
        /**
         * user_lp
         */
        userLp: 4,
        /**
         * user
         */
        user: 5,
        /**
         * token_program
         */
        tokenProgram: 6,
    },
    struct({
        unmintAmount: u64,
        minOutAmount: u64,
    }),
)

/**
 * user withdraw liquidity from vault, if vault reserve doesn't have enough liquidity, it will withdraw from the strategy firstly
 */
export interface WithdrawDirectlyFromStrategy {
    unmintAmount: bigint
    minOutAmount: bigint
}

/**
 * user withdraw liquidity from vault, if vault reserve doesn't have enough liquidity, it will withdraw from the strategy firstly
 */
export const withdrawDirectlyFromStrategy = instruction(
    {
        d8: '0xc98d922ead74c616',
    },
    {
        /**
         * vault
         */
        vault: 0,
        /**
         * strategy
         */
        strategy: 1,
        reserve: 2,
        strategyProgram: 3,
        /**
         * collateral_vault
         */
        collateralVault: 4,
        /**
         * token_vault
         */
        tokenVault: 5,
        /**
         * lp_mint
         */
        lpMint: 6,
        /**
         * fee_vault
         */
        feeVault: 7,
        /**
         * user_token
         */
        userToken: 8,
        /**
         * user_lp
         */
        userLp: 9,
        /**
         * user
         */
        user: 10,
        /**
         * token_program
         */
        tokenProgram: 11,
    },
    struct({
        unmintAmount: u64,
        minOutAmount: u64,
    }),
)
