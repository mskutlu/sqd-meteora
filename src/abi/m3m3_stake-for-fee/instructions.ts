import {struct, unit, u64} from '@subsquid/borsh'
import {instruction} from '../abi.support'
import {InitializeVaultParams} from './types'

export interface InitializeVault {
    params: InitializeVaultParams
}

export const initializeVault = instruction(
    {
        d8: '0x30bfa32c47813fa4',
    },
    {
        /**
         * Vault account
         */
        vault: 0,
        /**
         * Token a vault
         */
        stakeTokenVault: 1,
        /**
         * Token b vault
         */
        quoteTokenVault: 2,
        /**
         * Top staker list account
         */
        topStakerList: 3,
        /**
         * Full balance list account
         */
        fullBalanceList: 4,
        /**
         * Pool account
         */
        pool: 5,
        /**
         * Stake mint
         */
        stakeMint: 6,
        /**
         * Quote mint
         */
        quoteMint: 7,
        /**
         * Escrow account
         */
        lockEscrow: 8,
        payer: 9,
        systemProgram: 10,
        tokenProgram: 11,
        associatedTokenProgram: 12,
        eventAuthority: 13,
        program: 14,
    },
    struct({
        params: InitializeVaultParams,
    }),
)

export type InitializeStakeEscrow = undefined

export const initializeStakeEscrow = instruction(
    {
        d8: '0x43ed6f6edad61d99',
    },
    {
        vault: 0,
        escrow: 1,
        fullBalanceList: 2,
        topStakerList: 3,
        owner: 4,
        payer: 5,
        systemProgram: 6,
        eventAuthority: 7,
        program: 8,
    },
    unit,
)

export interface Stake {
    amount: bigint
}

export const stake = instruction(
    {
        d8: '0xceb0ca12c8d1b36c',
    },
    {
        vault: 0,
        stakeTokenVault: 1,
        quoteTokenVault: 2,
        topStakerList: 3,
        fullBalanceList: 4,
        stakeEscrow: 5,
        smallestStakeEscrow: 6,
        userStakeToken: 7,
        owner: 8,
        pool: 9,
        lpMint: 10,
        lockEscrow: 11,
        escrowVault: 12,
        aTokenVault: 13,
        bTokenVault: 14,
        aVault: 15,
        bVault: 16,
        aVaultLp: 17,
        bVaultLp: 18,
        aVaultLpMint: 19,
        bVaultLpMint: 20,
        ammProgram: 21,
        vaultProgram: 22,
        tokenProgram: 23,
        eventAuthority: 24,
        program: 25,
    },
    struct({
        amount: u64,
    }),
)

/**
 * The endpoint will only claim the quote token (SOL or USDC). The meme token will be automatically restaked.
 */
export interface ClaimFee {
    maxFee: bigint
}

/**
 * The endpoint will only claim the quote token (SOL or USDC). The meme token will be automatically restaked.
 */
export const claimFee = instruction(
    {
        d8: '0xa9204f8988e84689',
    },
    {
        vault: 0,
        topStakerList: 1,
        fullBalanceList: 2,
        stakeEscrow: 3,
        smallestStakeEscrow: 4,
        userQuoteToken: 5,
        stakeTokenVault: 6,
        quoteTokenVault: 7,
        owner: 8,
        pool: 9,
        lpMint: 10,
        lockEscrow: 11,
        escrowVault: 12,
        aTokenVault: 13,
        bTokenVault: 14,
        aVault: 15,
        bVault: 16,
        aVaultLp: 17,
        bVaultLp: 18,
        aVaultLpMint: 19,
        bVaultLpMint: 20,
        ammProgram: 21,
        vaultProgram: 22,
        tokenProgram: 23,
        eventAuthority: 24,
        program: 25,
    },
    struct({
        maxFee: u64,
    }),
)

export interface RequestUnstake {
    unstakeAmount: bigint
}

export const requestUnstake = instruction(
    {
        d8: '0x2c9a6efda0ca3622',
    },
    {
        unstake: 0,
        vault: 1,
        topStakerList: 2,
        fullBalanceList: 3,
        stakeEscrow: 4,
        stakeTokenVault: 5,
        quoteTokenVault: 6,
        owner: 7,
        pool: 8,
        lpMint: 9,
        lockEscrow: 10,
        escrowVault: 11,
        aTokenVault: 12,
        bTokenVault: 13,
        aVault: 14,
        bVault: 15,
        aVaultLp: 16,
        bVaultLp: 17,
        aVaultLpMint: 18,
        bVaultLpMint: 19,
        ammProgram: 20,
        vaultProgram: 21,
        tokenProgram: 22,
        systemProgram: 23,
        eventAuthority: 24,
        program: 25,
    },
    struct({
        unstakeAmount: u64,
    }),
)

export type CancelUnstake = undefined

export const cancelUnstake = instruction(
    {
        d8: '0x404135e37d9903a7',
    },
    {
        unstake: 0,
        stakeEscrow: 1,
        smallestStakeEscrow: 2,
        topStakerList: 3,
        fullBalanceList: 4,
        vault: 5,
        stakeTokenVault: 6,
        quoteTokenVault: 7,
        owner: 8,
        pool: 9,
        lpMint: 10,
        lockEscrow: 11,
        escrowVault: 12,
        aTokenVault: 13,
        bTokenVault: 14,
        aVault: 15,
        bVault: 16,
        aVaultLp: 17,
        bVaultLp: 18,
        aVaultLpMint: 19,
        bVaultLpMint: 20,
        ammProgram: 21,
        vaultProgram: 22,
        tokenProgram: 23,
        eventAuthority: 24,
        program: 25,
    },
    unit,
)

export type Withdraw = undefined

export const withdraw = instruction(
    {
        d8: '0xb712469c946da122',
    },
    {
        unstake: 0,
        stakeEscrow: 1,
        stakeTokenVault: 2,
        vault: 3,
        userStakeToken: 4,
        owner: 5,
        tokenProgram: 6,
        eventAuthority: 7,
        program: 8,
    },
    unit,
)

export type ClaimFeeCrank = undefined

export const claimFeeCrank = instruction(
    {
        d8: '0xcac79302ffc701de',
    },
    {
        vault: 0,
        stakeTokenVault: 1,
        quoteTokenVault: 2,
        pool: 3,
        lpMint: 4,
        lockEscrow: 5,
        escrowVault: 6,
        aTokenVault: 7,
        bTokenVault: 8,
        aVault: 9,
        bVault: 10,
        aVaultLp: 11,
        bVaultLp: 12,
        aVaultLpMint: 13,
        bVaultLpMint: 14,
        ammProgram: 15,
        vaultProgram: 16,
        tokenProgram: 17,
        eventAuthority: 18,
        program: 19,
    },
    unit,
)

export interface UpdateUnstakeLockDuration {
    unstakeLockDuration: bigint
}

export const updateUnstakeLockDuration = instruction(
    {
        d8: '0x53c3c4e0c8514660',
    },
    {
        vault: 0,
        admin: 1,
        eventAuthority: 2,
        program: 3,
    },
    struct({
        unstakeLockDuration: u64,
    }),
)

export interface UpdateSecondsToFullUnlock {
    secondsToFullUnlock: bigint
}

export const updateSecondsToFullUnlock = instruction(
    {
        d8: '0x160236244a92078d',
    },
    {
        vault: 0,
        instructionsSysvar: 1,
        admin: 2,
        eventAuthority: 3,
        program: 4,
    },
    struct({
        secondsToFullUnlock: u64,
    }),
)

/**
 * To force IDL generation for some struct for easier TS decoding later
 */
export type Dummy = undefined

/**
 * To force IDL generation for some struct for easier TS decoding later
 */
export const dummy = instruction(
    {
        d8: '0xa775d34ffbfe2f87',
    },
    {
        stakerMetadata: 0,
        stakerBalance: 1,
    },
    unit,
)
