import {Codec, struct, fixedArray, u8, u64, address, unit, sum, u128} from '@subsquid/borsh'

export interface CreateMerkleRootConfigParams {
    /**
     * The 256-bit merkle root.
     */
    root: Array<number>
    /**
     * version
     */
    version: bigint
}

export const CreateMerkleRootConfigParams: Codec<CreateMerkleRootConfigParams> = struct({
    /**
     * The 256-bit merkle root.
     */
    root: fixedArray(u8, 32),
    /**
     * version
     */
    version: u64,
})

export interface FcfsConfigParameters {
    maxDepositingCap: bigint
    startVestingDuration: bigint
    endVestingDuration: bigint
    depositingDurationUntilLastJoinPoint: bigint
    individualDepositingCap: bigint
    escrowFee: bigint
    activationType: number
    index: bigint
}

export const FcfsConfigParameters: Codec<FcfsConfigParameters> = struct({
    maxDepositingCap: u64,
    startVestingDuration: u64,
    endVestingDuration: u64,
    depositingDurationUntilLastJoinPoint: u64,
    individualDepositingCap: u64,
    escrowFee: u64,
    activationType: u8,
    index: u64,
})

export interface InitializeFcfsVaultParams {
    poolType: number
    quoteMint: string
    baseMint: string
    depositingPoint: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
    maxDepositingCap: bigint
    individualDepositingCap: bigint
    escrowFee: bigint
    whitelistMode: number
}

export const InitializeFcfsVaultParams: Codec<InitializeFcfsVaultParams> = struct({
    poolType: u8,
    quoteMint: address,
    baseMint: address,
    depositingPoint: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
    maxDepositingCap: u64,
    individualDepositingCap: u64,
    escrowFee: u64,
    whitelistMode: u8,
})

export interface UpdateFcfsVaultParams {
    maxDepositingCap: bigint
    depositingPoint: bigint
    individualDepositingCap: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
}

export const UpdateFcfsVaultParams: Codec<UpdateFcfsVaultParams> = struct({
    maxDepositingCap: u64,
    depositingPoint: u64,
    individualDepositingCap: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
})

export interface ProrataConfigParameters {
    maxBuyingCap: bigint
    startVestingDuration: bigint
    endVestingDuration: bigint
    escrowFee: bigint
    activationType: number
    index: bigint
}

export const ProrataConfigParameters: Codec<ProrataConfigParameters> = struct({
    maxBuyingCap: u64,
    startVestingDuration: u64,
    endVestingDuration: u64,
    escrowFee: u64,
    activationType: u8,
    index: u64,
})

export interface InitializeProrataVaultParams {
    poolType: number
    quoteMint: string
    baseMint: string
    depositingPoint: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
    maxBuyingCap: bigint
    escrowFee: bigint
    whitelistMode: number
}

export const InitializeProrataVaultParams: Codec<InitializeProrataVaultParams> = struct({
    poolType: u8,
    quoteMint: address,
    baseMint: address,
    depositingPoint: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
    maxBuyingCap: u64,
    escrowFee: u64,
    whitelistMode: u8,
})

export interface InitializeVaultWithConfigParams {
    poolType: number
    quoteMint: string
    baseMint: string
    whitelistMode: number
}

export const InitializeVaultWithConfigParams: Codec<InitializeVaultWithConfigParams> = struct({
    poolType: u8,
    quoteMint: address,
    baseMint: address,
    whitelistMode: u8,
})

export interface UpdateProrataVaultParams {
    maxBuyingCap: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
}

export const UpdateProrataVaultParams: Codec<UpdateProrataVaultParams> = struct({
    maxBuyingCap: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
})

export type ActivationType_Slot = undefined

export const ActivationType_Slot = unit

export type ActivationType_Timestamp = undefined

export const ActivationType_Timestamp = unit

export type ActivationType = 
    | {
        kind: 'Slot'
        value?: ActivationType_Slot
      }
    | {
        kind: 'Timestamp'
        value?: ActivationType_Timestamp
      }

export const ActivationType: Codec<ActivationType> = sum(1, {
    Slot: {
        discriminator: 0,
        value: ActivationType_Slot,
    },
    Timestamp: {
        discriminator: 1,
        value: ActivationType_Timestamp,
    },
})

export type PoolType_Dlmm = undefined

export const PoolType_Dlmm = unit

export type PoolType_DynamicPool = undefined

export const PoolType_DynamicPool = unit

export type PoolType = 
    | {
        kind: 'Dlmm'
        value?: PoolType_Dlmm
      }
    | {
        kind: 'DynamicPool'
        value?: PoolType_DynamicPool
      }

export const PoolType: Codec<PoolType> = sum(1, {
    Dlmm: {
        discriminator: 0,
        value: PoolType_Dlmm,
    },
    DynamicPool: {
        discriminator: 1,
        value: PoolType_DynamicPool,
    },
})

export type VaultMode_Prorata = undefined

export const VaultMode_Prorata = unit

export type VaultMode_Fcfs = undefined

export const VaultMode_Fcfs = unit

export type VaultMode = 
    | {
        kind: 'Prorata'
        value?: VaultMode_Prorata
      }
    | {
        kind: 'Fcfs'
        value?: VaultMode_Fcfs
      }

export const VaultMode: Codec<VaultMode> = sum(1, {
    Prorata: {
        discriminator: 0,
        value: VaultMode_Prorata,
    },
    Fcfs: {
        discriminator: 1,
        value: VaultMode_Fcfs,
    },
})

export type WhitelistMode_Permissionless = undefined

export const WhitelistMode_Permissionless = unit

export type WhitelistMode_PermissionWithMerkleProof = undefined

export const WhitelistMode_PermissionWithMerkleProof = unit

export type WhitelistMode_PermissionWithAuthority = undefined

export const WhitelistMode_PermissionWithAuthority = unit

export type WhitelistMode = 
    | {
        kind: 'Permissionless'
        value?: WhitelistMode_Permissionless
      }
    | {
        kind: 'PermissionWithMerkleProof'
        value?: WhitelistMode_PermissionWithMerkleProof
      }
    | {
        kind: 'PermissionWithAuthority'
        value?: WhitelistMode_PermissionWithAuthority
      }

export const WhitelistMode: Codec<WhitelistMode> = sum(1, {
    Permissionless: {
        discriminator: 0,
        value: WhitelistMode_Permissionless,
    },
    PermissionWithMerkleProof: {
        discriminator: 1,
        value: WhitelistMode_PermissionWithMerkleProof,
    },
    PermissionWithAuthority: {
        discriminator: 2,
        value: WhitelistMode_PermissionWithAuthority,
    },
})

export interface Escrow {
    /**
     * vault address
     */
    vault: string
    /**
     * owner
     */
    owner: string
    /**
     * total deposited quote token
     */
    totalDeposit: bigint
    /**
     * Total token that escrow has claimed
     */
    claimedToken: bigint
    /**
     * Last claimed timestamp
     */
    lastClaimedPoint: bigint
    /**
     * Whether owner has claimed for remaining quote token
     */
    refunded: number
    /**
     * padding 1
     */
    padding1: Array<number>
    /**
     * Only has meaning in permissioned vault
     */
    maxCap: bigint
    /**
     * padding 2
     */
    padding2: Array<number>
    padding: Array<bigint>
}

export const Escrow: Codec<Escrow> = struct({
    /**
     * vault address
     */
    vault: address,
    /**
     * owner
     */
    owner: address,
    /**
     * total deposited quote token
     */
    totalDeposit: u64,
    /**
     * Total token that escrow has claimed
     */
    claimedToken: u64,
    /**
     * Last claimed timestamp
     */
    lastClaimedPoint: u64,
    /**
     * Whether owner has claimed for remaining quote token
     */
    refunded: u8,
    /**
     * padding 1
     */
    padding1: fixedArray(u8, 7),
    /**
     * Only has meaning in permissioned vault
     */
    maxCap: u64,
    /**
     * padding 2
     */
    padding2: fixedArray(u8, 8),
    padding: fixedArray(u128, 1),
})

export interface MerkleRootConfig {
    /**
     * The 256-bit merkle root.
     */
    root: Array<number>
    /**
     * vault pubkey that config is belong
     */
    vault: string
    /**
     * version
     */
    version: bigint
    /**
     * padding for further use
     */
    padding: Array<bigint>
}

export const MerkleRootConfig: Codec<MerkleRootConfig> = struct({
    /**
     * The 256-bit merkle root.
     */
    root: fixedArray(u8, 32),
    /**
     * vault pubkey that config is belong
     */
    vault: address,
    /**
     * version
     */
    version: u64,
    /**
     * padding for further use
     */
    padding: fixedArray(u128, 4),
})

export interface ProrataVaultConfig {
    maxBuyingCap: bigint
    startVestingDuration: bigint
    endVestingDuration: bigint
    escrowFee: bigint
    activationType: number
    padding: Array<number>
}

export const ProrataVaultConfig: Codec<ProrataVaultConfig> = struct({
    maxBuyingCap: u64,
    startVestingDuration: u64,
    endVestingDuration: u64,
    escrowFee: u64,
    activationType: u8,
    padding: fixedArray(u8, 191),
})

export interface FcfsVaultConfig {
    maxDepositingCap: bigint
    startVestingDuration: bigint
    endVestingDuration: bigint
    depositingDurationUntilLastJoinPoint: bigint
    individualDepositingCap: bigint
    escrowFee: bigint
    activationType: number
    padding: Array<number>
}

export const FcfsVaultConfig: Codec<FcfsVaultConfig> = struct({
    maxDepositingCap: u64,
    startVestingDuration: u64,
    endVestingDuration: u64,
    depositingDurationUntilLastJoinPoint: u64,
    individualDepositingCap: u64,
    escrowFee: u64,
    activationType: u8,
    padding: fixedArray(u8, 175),
})

export interface Vault {
    /**
     * pool
     */
    pool: string
    /**
     * reserve quote token
     */
    tokenVault: string
    /**
     * reserve base token
     */
    tokenOutVault: string
    /**
     * quote token
     */
    quoteMint: string
    /**
     * base token
     */
    baseMint: string
    /**
     * base key
     */
    base: string
    /**
     * owner key, deprecated field, can re-use in the future
     */
    owner: string
    /**
     * max buying cap
     */
    maxBuyingCap: bigint
    /**
     * total deposited quote token
     */
    totalDeposit: bigint
    /**
     * total user deposit
     */
    totalEscrow: bigint
    /**
     * swapped_amount
     */
    swappedAmount: bigint
    /**
     * total bought token
     */
    boughtToken: bigint
    /**
     * Total quote refund
     */
    totalRefund: bigint
    /**
     * Total claimed_token
     */
    totalClaimedToken: bigint
    /**
     * Start vesting ts
     */
    startVestingPoint: bigint
    /**
     * End vesting ts
     */
    endVestingPoint: bigint
    /**
     * bump
     */
    bump: number
    /**
     * pool type
     */
    poolType: number
    /**
     * vault mode
     */
    vaultMode: number
    /**
     * padding 0
     */
    padding0: Array<number>
    /**
     * max depositing cap
     */
    maxDepositingCap: bigint
    /**
     * individual depositing cap
     */
    individualDepositingCap: bigint
    /**
     * depositing point
     */
    depositingPoint: bigint
    /**
     * flat fee when user open an escrow
     */
    escrowFee: bigint
    /**
     * total escrow fee just for statistic
     */
    totalEscrowFee: bigint
    /**
     * deposit whitelist mode
     */
    whitelistMode: number
    /**
     * activation type
     */
    activationType: number
    /**
     * padding 1
     */
    padding1: Array<number>
    /**
     * vault authority normally is vault creator, will be able to create merkle root config
     */
    vaultAuthority: string
    padding: Array<bigint>
}

export const Vault: Codec<Vault> = struct({
    /**
     * pool
     */
    pool: address,
    /**
     * reserve quote token
     */
    tokenVault: address,
    /**
     * reserve base token
     */
    tokenOutVault: address,
    /**
     * quote token
     */
    quoteMint: address,
    /**
     * base token
     */
    baseMint: address,
    /**
     * base key
     */
    base: address,
    /**
     * owner key, deprecated field, can re-use in the future
     */
    owner: address,
    /**
     * max buying cap
     */
    maxBuyingCap: u64,
    /**
     * total deposited quote token
     */
    totalDeposit: u64,
    /**
     * total user deposit
     */
    totalEscrow: u64,
    /**
     * swapped_amount
     */
    swappedAmount: u64,
    /**
     * total bought token
     */
    boughtToken: u64,
    /**
     * Total quote refund
     */
    totalRefund: u64,
    /**
     * Total claimed_token
     */
    totalClaimedToken: u64,
    /**
     * Start vesting ts
     */
    startVestingPoint: u64,
    /**
     * End vesting ts
     */
    endVestingPoint: u64,
    /**
     * bump
     */
    bump: u8,
    /**
     * pool type
     */
    poolType: u8,
    /**
     * vault mode
     */
    vaultMode: u8,
    /**
     * padding 0
     */
    padding0: fixedArray(u8, 5),
    /**
     * max depositing cap
     */
    maxDepositingCap: u64,
    /**
     * individual depositing cap
     */
    individualDepositingCap: u64,
    /**
     * depositing point
     */
    depositingPoint: u64,
    /**
     * flat fee when user open an escrow
     */
    escrowFee: u64,
    /**
     * total escrow fee just for statistic
     */
    totalEscrowFee: u64,
    /**
     * deposit whitelist mode
     */
    whitelistMode: u8,
    /**
     * activation type
     */
    activationType: u8,
    /**
     * padding 1
     */
    padding1: fixedArray(u8, 6),
    /**
     * vault authority normally is vault creator, will be able to create merkle root config
     */
    vaultAuthority: address,
    padding: fixedArray(u128, 5),
})

export interface ProrataVaultCreated {
    baseMint: string
    quoteMint: string
    startVestingPoint: bigint
    endVestingPoint: bigint
    maxBuyingCap: bigint
    pool: string
    poolType: number
    escrowFee: bigint
    activationType: number
}

export const ProrataVaultCreated: Codec<ProrataVaultCreated> = struct({
    baseMint: address,
    quoteMint: address,
    startVestingPoint: u64,
    endVestingPoint: u64,
    maxBuyingCap: u64,
    pool: address,
    poolType: u8,
    escrowFee: u64,
    activationType: u8,
})

export interface FcfsVaultCreated {
    baseMint: string
    quoteMint: string
    startVestingPoint: bigint
    endVestingPoint: bigint
    maxDepositingCap: bigint
    pool: string
    poolType: number
    depositingPoint: bigint
    individualDepositingCap: bigint
    escrowFee: bigint
    activationType: number
}

export const FcfsVaultCreated: Codec<FcfsVaultCreated> = struct({
    baseMint: address,
    quoteMint: address,
    startVestingPoint: u64,
    endVestingPoint: u64,
    maxDepositingCap: u64,
    pool: address,
    poolType: u8,
    depositingPoint: u64,
    individualDepositingCap: u64,
    escrowFee: u64,
    activationType: u8,
})

export interface EscrowCreated {
    vault: string
    escrow: string
    owner: string
    vaultTotalEscrow: bigint
    escrowFee: bigint
}

export const EscrowCreated: Codec<EscrowCreated> = struct({
    vault: address,
    escrow: address,
    owner: address,
    vaultTotalEscrow: u64,
    escrowFee: u64,
})

export interface MerkleRootConfigCreated {
    admin: string
    config: string
    vault: string
    version: bigint
    root: Array<number>
}

export const MerkleRootConfigCreated: Codec<MerkleRootConfigCreated> = struct({
    admin: address,
    config: address,
    vault: address,
    version: u64,
    root: fixedArray(u8, 32),
})

export interface ProrataVaultParametersUpdated {
    vault: string
    maxBuyingCap: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
}

export const ProrataVaultParametersUpdated: Codec<ProrataVaultParametersUpdated> = struct({
    vault: address,
    maxBuyingCap: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
})

export interface FcfsVaultParametersUpdated {
    vault: string
    maxDepositingCap: bigint
    startVestingPoint: bigint
    endVestingPoint: bigint
    depositingPoint: bigint
    individualDepositingCap: bigint
}

export const FcfsVaultParametersUpdated: Codec<FcfsVaultParametersUpdated> = struct({
    vault: address,
    maxDepositingCap: u64,
    startVestingPoint: u64,
    endVestingPoint: u64,
    depositingPoint: u64,
    individualDepositingCap: u64,
})

export interface EscrowRemainingWithdraw {
    vault: string
    escrow: string
    owner: string
    amount: bigint
    vaultRemainingDeposit: bigint
}

export const EscrowRemainingWithdraw: Codec<EscrowRemainingWithdraw> = struct({
    vault: address,
    escrow: address,
    owner: address,
    amount: u64,
    vaultRemainingDeposit: u64,
})

export interface EscrowWithdraw {
    vault: string
    escrow: string
    owner: string
    amount: bigint
    vaultTotalDeposit: bigint
}

export const EscrowWithdraw: Codec<EscrowWithdraw> = struct({
    vault: address,
    escrow: address,
    owner: address,
    amount: u64,
    vaultTotalDeposit: u64,
})

export interface SwapFill {
    vault: string
    pair: string
    fillAmount: bigint
    purchasedAmount: bigint
    unfilledAmount: bigint
}

export const SwapFill: Codec<SwapFill> = struct({
    vault: address,
    pair: address,
    fillAmount: u64,
    purchasedAmount: u64,
    unfilledAmount: u64,
})

export interface EscrowDeposit {
    vault: string
    escrow: string
    owner: string
    amount: bigint
    vaultTotalDeposit: bigint
}

export const EscrowDeposit: Codec<EscrowDeposit> = struct({
    vault: address,
    escrow: address,
    owner: address,
    amount: u64,
    vaultTotalDeposit: u64,
})

export interface EscrowClosed {
    vault: string
    escrow: string
    owner: string
    vaultTotalEscrow: bigint
}

export const EscrowClosed: Codec<EscrowClosed> = struct({
    vault: address,
    escrow: address,
    owner: address,
    vaultTotalEscrow: u64,
})

export interface EscrowClaimToken {
    vault: string
    escrow: string
    owner: string
    amount: bigint
    vaultTotalClaimedToken: bigint
}

export const EscrowClaimToken: Codec<EscrowClaimToken> = struct({
    vault: address,
    escrow: address,
    owner: address,
    amount: u64,
    vaultTotalClaimedToken: u64,
})
