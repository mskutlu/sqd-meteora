import {struct, address, unit, u64, array, fixedArray, u8} from '@subsquid/borsh'
import {instruction} from '../abi.support'
import {InitializeProrataVaultParams, InitializeVaultWithConfigParams, UpdateProrataVaultParams, ProrataConfigParameters, InitializeFcfsVaultParams, UpdateFcfsVaultParams, FcfsConfigParameters, CreateMerkleRootConfigParams} from './types'

export interface TransferVaultAuthority {
    newAuthority: string
}

export const transferVaultAuthority = instruction(
    {
        d8: '0x8b23535834baa26e',
    },
    {
        vault: 0,
        vaultAuthority: 1,
    },
    struct({
        newAuthority: address,
    }),
)

export interface InitializeProrataVault {
    params: InitializeProrataVaultParams
}

export const initializeProrataVault = instruction(
    {
        d8: '0xb2b4b0f780ba2b09',
    },
    {
        vault: 0,
        pool: 1,
        funder: 2,
        base: 3,
        systemProgram: 4,
        eventAuthority: 5,
        program: 6,
    },
    struct({
        params: InitializeProrataVaultParams,
    }),
)

export interface InitializeVaultWithProrataConfig {
    params: InitializeVaultWithConfigParams
}

export const initializeVaultWithProrataConfig = instruction(
    {
        d8: '0x9bd822a267f2ecd3',
    },
    {
        vault: 0,
        pool: 1,
        quoteMint: 2,
        funder: 3,
        config: 4,
        systemProgram: 5,
        eventAuthority: 6,
        program: 7,
    },
    struct({
        params: InitializeVaultWithConfigParams,
    }),
)

export interface UpdateProrataVaultParameters {
    params: UpdateProrataVaultParams
}

export const updateProrataVaultParameters = instruction(
    {
        d8: '0xb1279732fdf9054a',
    },
    {
        vault: 0,
        pool: 1,
        admin: 2,
        eventAuthority: 3,
        program: 4,
    },
    struct({
        params: UpdateProrataVaultParams,
    }),
)

export interface CreateProrataConfig {
    configParameters: ProrataConfigParameters
}

export const createProrataConfig = instruction(
    {
        d8: '0x26cb48e7671dc33d',
    },
    {
        config: 0,
        admin: 1,
        systemProgram: 2,
    },
    struct({
        configParameters: ProrataConfigParameters,
    }),
)

export type CloseProrataConfig = undefined

export const closeProrataConfig = instruction(
    {
        d8: '0x548c6739b29b391a',
    },
    {
        config: 0,
        admin: 1,
        rentReceiver: 2,
    },
    unit,
)

export interface InitializeFcfsVault {
    params: InitializeFcfsVaultParams
}

export const initializeFcfsVault = instruction(
    {
        d8: '0xa3cd4591eb472f15',
    },
    {
        vault: 0,
        pool: 1,
        funder: 2,
        base: 3,
        systemProgram: 4,
        eventAuthority: 5,
        program: 6,
    },
    struct({
        params: InitializeFcfsVaultParams,
    }),
)

export interface InitializeVaultWithFcfsConfig {
    params: InitializeVaultWithConfigParams
}

export const initializeVaultWithFcfsConfig = instruction(
    {
        d8: '0xbdfb5c68eb1551b6',
    },
    {
        vault: 0,
        pool: 1,
        quoteMint: 2,
        funder: 3,
        config: 4,
        systemProgram: 5,
        eventAuthority: 6,
        program: 7,
    },
    struct({
        params: InitializeVaultWithConfigParams,
    }),
)

export interface UpdateFcfsVaultParameters {
    params: UpdateFcfsVaultParams
}

export const updateFcfsVaultParameters = instruction(
    {
        d8: '0xac170d8f128568ae',
    },
    {
        vault: 0,
        pool: 1,
        admin: 2,
        eventAuthority: 3,
        program: 4,
    },
    struct({
        params: UpdateFcfsVaultParams,
    }),
)

export interface CreateFcfsConfig {
    configParameters: FcfsConfigParameters
}

export const createFcfsConfig = instruction(
    {
        d8: '0x07fff2f20163b30c',
    },
    {
        config: 0,
        admin: 1,
        systemProgram: 2,
    },
    struct({
        configParameters: FcfsConfigParameters,
    }),
)

export type CloseFcfsConfig = undefined

export const closeFcfsConfig = instruction(
    {
        d8: '0x30b2d465178ae95a',
    },
    {
        config: 0,
        admin: 1,
        rentReceiver: 2,
    },
    unit,
)

export interface CreateMerkleRootConfig {
    params: CreateMerkleRootConfigParams
}

export const createMerkleRootConfig = instruction(
    {
        d8: '0x37f3fdf04ebae8a6',
    },
    {
        vault: 0,
        merkleRootConfig: 1,
        admin: 2,
        systemProgram: 3,
        eventAuthority: 4,
        program: 5,
    },
    struct({
        params: CreateMerkleRootConfigParams,
    }),
)

export type CreateNewEscrow = undefined

export const createNewEscrow = instruction(
    {
        d8: '0x3c9aaacafc6d53c7',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        owner: 3,
        payer: 4,
        escrowFeeReceiver: 5,
        systemProgram: 6,
        eventAuthority: 7,
        program: 8,
    },
    unit,
)

export interface CreatePermissionedEscrow {
    maxCap: bigint
    proof: Array<Array<number>>
}

export const createPermissionedEscrow = instruction(
    {
        d8: '0x3ca62455608984b8',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        owner: 3,
        /**
         * merkle_root_config
         */
        merkleRootConfig: 4,
        payer: 5,
        escrowFeeReceiver: 6,
        systemProgram: 7,
        eventAuthority: 8,
        program: 9,
    },
    struct({
        maxCap: u64,
        proof: array(fixedArray(u8, 32)),
    }),
)

export interface CreatePermissionedEscrowWithAuthority {
    maxCap: bigint
}

export const createPermissionedEscrowWithAuthority = instruction(
    {
        d8: '0xd3e7c245410b7b5d',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        owner: 3,
        payer: 4,
        systemProgram: 5,
        eventAuthority: 6,
        program: 7,
    },
    struct({
        maxCap: u64,
    }),
)

export type CloseEscrow = undefined

export const closeEscrow = instruction(
    {
        d8: '0x8bab5e92bf5b9032',
    },
    {
        vault: 0,
        escrow: 1,
        owner: 2,
        rentReceiver: 3,
        eventAuthority: 4,
        program: 5,
    },
    unit,
)

export interface Deposit {
    maxAmount: bigint
}

export const deposit = instruction(
    {
        d8: '0xf223c68952e1f2b6',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        sourceToken: 3,
        tokenVault: 4,
        tokenMint: 5,
        tokenProgram: 6,
        owner: 7,
        eventAuthority: 8,
        program: 9,
    },
    struct({
        maxAmount: u64,
    }),
)

export interface Withdraw {
    amount: bigint
}

export const withdraw = instruction(
    {
        d8: '0xb712469c946da122',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        destinationToken: 3,
        tokenVault: 4,
        tokenMint: 5,
        tokenProgram: 6,
        owner: 7,
        eventAuthority: 8,
        program: 9,
    },
    struct({
        amount: u64,
    }),
)

export type WithdrawRemainingQuote = undefined

export const withdrawRemainingQuote = instruction(
    {
        d8: '0x36fdbc2264913b7f',
    },
    {
        vault: 0,
        pool: 1,
        escrow: 2,
        tokenVault: 3,
        destinationToken: 4,
        tokenMint: 5,
        tokenProgram: 6,
        owner: 7,
        eventAuthority: 8,
        program: 9,
    },
    unit,
)

export type ClaimToken = undefined

export const claimToken = instruction(
    {
        d8: '0x74ce1bbfa6130049',
    },
    {
        vault: 0,
        escrow: 1,
        tokenOutVault: 2,
        destinationToken: 3,
        tokenMint: 4,
        tokenProgram: 5,
        owner: 6,
        eventAuthority: 7,
        program: 8,
    },
    unit,
)

export interface FillDlmm {
    maxAmount: bigint
}

export const fillDlmm = instruction(
    {
        d8: '0x016c8d0b047efbde',
    },
    {
        vault: 0,
        tokenVault: 1,
        tokenOutVault: 2,
        ammProgram: 3,
        pool: 4,
        binArrayBitmapExtension: 5,
        reserveX: 6,
        reserveY: 7,
        tokenXMint: 8,
        tokenYMint: 9,
        oracle: 10,
        tokenXProgram: 11,
        tokenYProgram: 12,
        dlmmEventAuthority: 13,
        eventAuthority: 14,
        program: 15,
    },
    struct({
        maxAmount: u64,
    }),
)

export interface FillDynamicAmm {
    maxAmount: bigint
}

export const fillDynamicAmm = instruction(
    {
        d8: '0xe0e2df50243246e7',
    },
    {
        vault: 0,
        tokenVault: 1,
        tokenOutVault: 2,
        ammProgram: 3,
        pool: 4,
        aVault: 5,
        bVault: 6,
        aTokenVault: 7,
        bTokenVault: 8,
        aVaultLpMint: 9,
        bVaultLpMint: 10,
        aVaultLp: 11,
        bVaultLp: 12,
        adminTokenFee: 13,
        vaultProgram: 14,
        tokenProgram: 15,
        eventAuthority: 16,
        program: 17,
    },
    struct({
        maxAmount: u64,
    }),
)
