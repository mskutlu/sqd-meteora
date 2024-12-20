import {Codec, struct, u16, u64, option, fixedArray, u8, address, i64, u128, unit, sum, ref} from '@subsquid/borsh'

export interface InitializeVaultParams {
    topListLength: number
    secondsToFullUnlock: bigint
    unstakeLockDuration: bigint
    startFeeDistributeTimestamp?: bigint | undefined
    padding: Array<number>
}

export const InitializeVaultParams: Codec<InitializeVaultParams> = struct({
    topListLength: u16,
    secondsToFullUnlock: u64,
    unstakeLockDuration: u64,
    startFeeDistributeTimestamp: option(u64),
    padding: fixedArray(u8, 64),
})

export interface StakerBalance {
    /**
     * Balance
     */
    balance: bigint
    /**
     * Owner pubkey, we don't need this for logic, but it is useful for indexing
     */
    owner: string
    /**
     * In top list
     */
    isInTopList: number
    /**
     * Padding
     */
    padding: Array<number>
}

export const StakerBalance: Codec<StakerBalance> = struct({
    /**
     * Balance
     */
    balance: u64,
    /**
     * Owner pubkey, we don't need this for logic, but it is useful for indexing
     */
    owner: address,
    /**
     * In top list
     */
    isInTopList: u8,
    /**
     * Padding
     */
    padding: fixedArray(u8, 7),
})

export interface StakerMetadata {
    /**
     * Staked amount
     */
    stakeAmount: bigint
    /**
     * Full balance list index. When it's negative, the slot is empty
     */
    fullBalanceIndex: bigint
    /**
     * Owner pubkey, we dont need this for logic, but it is useful for indexing
     */
    owner: string
}

export const StakerMetadata: Codec<StakerMetadata> = struct({
    /**
     * Staked amount
     */
    stakeAmount: u64,
    /**
     * Full balance list index. When it's negative, the slot is empty
     */
    fullBalanceIndex: i64,
    /**
     * Owner pubkey, we dont need this for logic, but it is useful for indexing
     */
    owner: address,
})

export interface Configuration {
    /**
     * Time required for locked claim fee to be fully dripped
     */
    secondsToFullUnlock: bigint
    /**
     * Unstake lock duration
     */
    unstakeLockDuration: bigint
    /**
     * When the fee start distributes
     */
    startFeeDistributeTimestamp: bigint
    /**
     * padding 0
     */
    padding0: bigint
    /**
     * padding
     */
    padding: Array<bigint>
}

export const Configuration: Codec<Configuration> = struct({
    /**
     * Time required for locked claim fee to be fully dripped
     */
    secondsToFullUnlock: u64,
    /**
     * Unstake lock duration
     */
    unstakeLockDuration: u64,
    /**
     * When the fee start distributes
     */
    startFeeDistributeTimestamp: i64,
    /**
     * padding 0
     */
    padding0: u64,
    /**
     * padding
     */
    padding: fixedArray(u128, 4),
})

export interface Metrics {
    /**
     * Total staked amount
     */
    totalStakedAmount: bigint
    /**
     * Total stake escrow count
     */
    totalStakeEscrowCount: bigint
    /**
     * Ongoing total partial unstake amount
     */
    ongoingTotalPartialUnstakeAmount: bigint
    /**
     * padding 0
     */
    padding0: bigint
    /**
     * Total claimed fee a amount
     */
    totalFeeAAmount: bigint
    /**
     * Total claimed fee b amount
     */
    totalFeeBAmount: bigint
    /**
     * User total claimed fee a
     */
    userTotalClaimedFeeA: bigint
    /**
     * User total claimed fee b
     */
    userTotalClaimedFeeB: bigint
    /**
     * padding
     */
    padding: Array<bigint>
}

export const Metrics: Codec<Metrics> = struct({
    /**
     * Total staked amount
     */
    totalStakedAmount: u64,
    /**
     * Total stake escrow count
     */
    totalStakeEscrowCount: u64,
    /**
     * Ongoing total partial unstake amount
     */
    ongoingTotalPartialUnstakeAmount: u64,
    /**
     * padding 0
     */
    padding0: u64,
    /**
     * Total claimed fee a amount
     */
    totalFeeAAmount: u128,
    /**
     * Total claimed fee b amount
     */
    totalFeeBAmount: u128,
    /**
     * User total claimed fee a
     */
    userTotalClaimedFeeA: u128,
    /**
     * User total claimed fee b
     */
    userTotalClaimedFeeB: u128,
    /**
     * padding
     */
    padding: fixedArray(u128, 4),
})

export interface TopStakerInfo {
    /**
     * Number of holder in the top list
     */
    topListLength: bigint
    /**
     * Current length, used for resize
     */
    currentLength: bigint
    /**
     * Effective stake amount. Total stake amount in the top list.
     */
    effectiveStakeAmount: bigint
    /**
     * Last claim fee at
     */
    lastClaimFeeAt: bigint
    /**
     * Last fee drip updated at
     */
    lastUpdatedAt: bigint
    /**
     * Locked fee a
     */
    lockedFeeA: bigint
    /**
     * Locked fee b
     */
    lockedFeeB: bigint
    /**
     * Padding
     */
    padding0: bigint
    /**
     * cumulative fee a per liquidity
     */
    cumulativeFeeAPerLiquidity: bigint
    /**
     * cumulative fee b per liquidity
     */
    cumulativeFeeBPerLiquidity: bigint
    /**
     * padding
     */
    padding: Array<bigint>
}

export const TopStakerInfo: Codec<TopStakerInfo> = struct({
    /**
     * Number of holder in the top list
     */
    topListLength: u64,
    /**
     * Current length, used for resize
     */
    currentLength: u64,
    /**
     * Effective stake amount. Total stake amount in the top list.
     */
    effectiveStakeAmount: u64,
    /**
     * Last claim fee at
     */
    lastClaimFeeAt: i64,
    /**
     * Last fee drip updated at
     */
    lastUpdatedAt: i64,
    /**
     * Locked fee a
     */
    lockedFeeA: u64,
    /**
     * Locked fee b
     */
    lockedFeeB: u64,
    /**
     * Padding
     */
    padding0: u64,
    /**
     * cumulative fee a per liquidity
     */
    cumulativeFeeAPerLiquidity: u128,
    /**
     * cumulative fee b per liquidity
     */
    cumulativeFeeBPerLiquidity: u128,
    /**
     * padding
     */
    padding: fixedArray(u128, 4),
})

export type Rounding_Up = undefined

export const Rounding_Up = unit

export type Rounding_Down = undefined

export const Rounding_Down = unit

export type Rounding = 
    | {
        kind: 'Up'
        value?: Rounding_Up
      }
    | {
        kind: 'Down'
        value?: Rounding_Down
      }

export const Rounding: Codec<Rounding> = sum(1, {
    Up: {
        discriminator: 0,
        value: Rounding_Up,
    },
    Down: {
        discriminator: 1,
        value: Rounding_Down,
    },
})

export interface StakerMetadataDummyAccount {
    stakerMetadata: StakerMetadata
}

export const StakerMetadataDummyAccount: Codec<StakerMetadataDummyAccount> = struct({
    stakerMetadata: ref(() => StakerMetadata),
})

export interface StakerBalanceDummyAccount {
    stakerBalance: StakerBalance
}

export const StakerBalanceDummyAccount: Codec<StakerBalanceDummyAccount> = struct({
    stakerBalance: ref(() => StakerBalance),
})

export interface FullBalanceListMetadata {
    vault: string
    length: bigint
}

export const FullBalanceListMetadata: Codec<FullBalanceListMetadata> = struct({
    vault: address,
    length: u64,
})

export interface StakeEscrow {
    owner: string
    vault: string
    fullBalanceIndex: bigint
    stakeAmount: bigint
    inTopList: number
    padding0: Array<number>
    ongoingTotalPartialUnstakeAmount: bigint
    createdAt: bigint
    feeAClaimedAmount: bigint
    feeBClaimedAmount: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
    feeAPending: bigint
    feeBPending: bigint
    padding: Array<bigint>
}

export const StakeEscrow: Codec<StakeEscrow> = struct({
    owner: address,
    vault: address,
    fullBalanceIndex: u64,
    stakeAmount: u64,
    inTopList: u8,
    padding0: fixedArray(u8, 15),
    ongoingTotalPartialUnstakeAmount: u64,
    createdAt: i64,
    feeAClaimedAmount: u128,
    feeBClaimedAmount: u128,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
    feeAPending: u64,
    feeBPending: u64,
    padding: fixedArray(u128, 20),
})

export interface TopListMetadata {
    /**
     * Vault
     */
    vault: string
}

export const TopListMetadata: Codec<TopListMetadata> = struct({
    /**
     * Vault
     */
    vault: address,
})

export interface Unstake {
    stakeEscrow: string
    unstakeAmount: bigint
    createdAt: bigint
    releaseAt: bigint
    padding: Array<bigint>
}

export const Unstake: Codec<Unstake> = struct({
    stakeEscrow: address,
    unstakeAmount: u64,
    createdAt: i64,
    releaseAt: i64,
    padding: fixedArray(u64, 30),
})

export interface FeeVault {
    /**
     * Lock escrow account
     */
    lockEscrow: string
    /**
     * Stake mint
     */
    stakeMint: string
    /**
     * Quote mint
     */
    quoteMint: string
    /**
     * Pool
     */
    pool: string
    /**
     * Stake token vault
     */
    stakeTokenVault: string
    /**
     * Quote token vault
     */
    quoteTokenVault: string
    /**
     * Top staker list
     */
    topStakerList: string
    /**
     * Full balance list
     */
    fullBalanceList: string
    /**
     * Metrics
     */
    metrics: Metrics
    /**
     * Configuration parameters
     */
    configuration: Configuration
    /**
     * Top staker info
     */
    topStakerInfo: TopStakerInfo
    /**
     * Creator
     */
    creator: string
    /**
     * Created at
     */
    createdAt: bigint
    /**
     * Bump
     */
    bump: number
    /**
     * Padding
     */
    padding0: Array<number>
    /**
     * Padding
     */
    padding: Array<bigint>
}

export const FeeVault: Codec<FeeVault> = struct({
    /**
     * Lock escrow account
     */
    lockEscrow: address,
    /**
     * Stake mint
     */
    stakeMint: address,
    /**
     * Quote mint
     */
    quoteMint: address,
    /**
     * Pool
     */
    pool: address,
    /**
     * Stake token vault
     */
    stakeTokenVault: address,
    /**
     * Quote token vault
     */
    quoteTokenVault: address,
    /**
     * Top staker list
     */
    topStakerList: address,
    /**
     * Full balance list
     */
    fullBalanceList: address,
    /**
     * Metrics
     */
    metrics: ref(() => Metrics),
    /**
     * Configuration parameters
     */
    configuration: ref(() => Configuration),
    /**
     * Top staker info
     */
    topStakerInfo: ref(() => TopStakerInfo),
    /**
     * Creator
     */
    creator: address,
    /**
     * Created at
     */
    createdAt: i64,
    /**
     * Bump
     */
    bump: u8,
    /**
     * Padding
     */
    padding0: fixedArray(u8, 7),
    /**
     * Padding
     */
    padding: fixedArray(u128, 20),
})

export interface VaultCreated {
    pool: string
    tokenAMint: string
    tokenBMint: string
    vault: string
    stakeMint: string
    quoteMint: string
    creator: string
    topListLength: number
    secondsToFullUnlock: bigint
    unstakeLockDuration: bigint
    startFeeDistributeTimestamp: bigint
}

export const VaultCreated: Codec<VaultCreated> = struct({
    pool: address,
    tokenAMint: address,
    tokenBMint: address,
    vault: address,
    stakeMint: address,
    quoteMint: address,
    creator: address,
    topListLength: u16,
    secondsToFullUnlock: u64,
    unstakeLockDuration: u64,
    startFeeDistributeTimestamp: i64,
})

export interface StakeEscrowCreated {
    pool: string
    vault: string
    escrow: string
    owner: string
    fullBalanceIndex: bigint
}

export const StakeEscrowCreated: Codec<StakeEscrowCreated> = struct({
    pool: address,
    vault: address,
    escrow: address,
    owner: address,
    fullBalanceIndex: u64,
})

export interface ConfigCreated {
    config: string
    index: bigint
    secondsToFullUnlock: bigint
    unstakeLockDuration: bigint
    joinWindowDuration: bigint
    topListLength: number
}

export const ConfigCreated: Codec<ConfigCreated> = struct({
    config: address,
    index: u64,
    secondsToFullUnlock: u64,
    unstakeLockDuration: u64,
    joinWindowDuration: u64,
    topListLength: u16,
})

export interface ConfigClosed {
    config: string
    index: bigint
}

export const ConfigClosed: Codec<ConfigClosed> = struct({
    config: address,
    index: u64,
})

export interface UnstakeCreated {
    unstake: string
    pool: string
    vault: string
    owner: string
    amount: bigint
    newStakeEscrowAmount: bigint
    newStakeEscrowOngoingTotalUnstakeAmount: bigint
    feeAPending: bigint
    feeBPending: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
    startAt: bigint
    endAt: bigint
}

export const UnstakeCreated: Codec<UnstakeCreated> = struct({
    unstake: address,
    pool: address,
    vault: address,
    owner: address,
    amount: u64,
    newStakeEscrowAmount: u64,
    newStakeEscrowOngoingTotalUnstakeAmount: u64,
    feeAPending: u64,
    feeBPending: u64,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
    startAt: i64,
    endAt: i64,
})

export interface CancelUnstakeSucceed {
    unstake: string
    pool: string
    vault: string
    owner: string
    amount: bigint
    newStakeEscrowAmount: bigint
    newStakeEscrowOngoingTotalUnstakeAmount: bigint
    feeAPending: bigint
    feeBPending: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
}

export const CancelUnstakeSucceed: Codec<CancelUnstakeSucceed> = struct({
    unstake: address,
    pool: address,
    vault: address,
    owner: address,
    amount: u64,
    newStakeEscrowAmount: u64,
    newStakeEscrowOngoingTotalUnstakeAmount: u64,
    feeAPending: u64,
    feeBPending: u64,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
})

export interface WithdrawSucceed {
    unstake: string
    pool: string
    vault: string
    owner: string
    amount: bigint
    newStakeEscrowOngoingTotalUnstakeAmount: bigint
}

export const WithdrawSucceed: Codec<WithdrawSucceed> = struct({
    unstake: address,
    pool: address,
    vault: address,
    owner: address,
    amount: u64,
    newStakeEscrowOngoingTotalUnstakeAmount: u64,
})

export interface ClaimFeeSucceed {
    stakeEscrow: string
    pool: string
    vault: string
    owner: string
    feeAAmount: bigint
    feeBAmount: bigint
    totalFeeAAmount: bigint
    totalFeeBAmount: bigint
}

export const ClaimFeeSucceed: Codec<ClaimFeeSucceed> = struct({
    stakeEscrow: address,
    pool: address,
    vault: address,
    owner: address,
    feeAAmount: u64,
    feeBAmount: u64,
    totalFeeAAmount: u128,
    totalFeeBAmount: u128,
})

export interface FeeEmission {
    pool: string
    vault: string
    tokenAClaimed: bigint
    tokenBClaimed: bigint
    tokenAReleased: bigint
    tokenBReleased: bigint
    cumulativeFeeAPerLiquidity: bigint
    cumulativeFeeBPerLiquidity: bigint
    effectiveStakeAmount: bigint
}

export const FeeEmission: Codec<FeeEmission> = struct({
    pool: address,
    vault: address,
    tokenAClaimed: u64,
    tokenBClaimed: u64,
    tokenAReleased: u64,
    tokenBReleased: u64,
    cumulativeFeeAPerLiquidity: u128,
    cumulativeFeeBPerLiquidity: u128,
    effectiveStakeAmount: u64,
})

export interface AddNewUserToTopHolder {
    pool: string
    vault: string
    owner: string
    stakeAmount: bigint
    feeAPending: bigint
    feeBPending: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
}

export const AddNewUserToTopHolder: Codec<AddNewUserToTopHolder> = struct({
    pool: address,
    vault: address,
    owner: address,
    stakeAmount: u64,
    feeAPending: u64,
    feeBPending: u64,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
})

export interface RemoveUserFromTopHolder {
    pool: string
    vault: string
    owner: string
    stakeAmount: bigint
    feeAPending: bigint
    feeBPending: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
}

export const RemoveUserFromTopHolder: Codec<RemoveUserFromTopHolder> = struct({
    pool: address,
    vault: address,
    owner: address,
    stakeAmount: u64,
    feeAPending: u64,
    feeBPending: u64,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
})

export interface UserStake {
    pool: string
    vault: string
    owner: string
    stakeAmount: bigint
    totalStakeAmount: bigint
    feeAPending: bigint
    feeBPending: bigint
    feeAPerLiquidityCheckpoint: bigint
    feeBPerLiquidityCheckpoint: bigint
}

export const UserStake: Codec<UserStake> = struct({
    pool: address,
    vault: address,
    owner: address,
    stakeAmount: u64,
    totalStakeAmount: u64,
    feeAPending: u64,
    feeBPending: u64,
    feeAPerLiquidityCheckpoint: u128,
    feeBPerLiquidityCheckpoint: u128,
})

export interface ReclaimIndex {
    vault: string
    inOwner: string
    inOwnerBalance: bigint
    outOwner: string
    outOwnerBalance: bigint
    reclaimIndex: bigint
}

export const ReclaimIndex: Codec<ReclaimIndex> = struct({
    vault: address,
    inOwner: address,
    inOwnerBalance: u64,
    outOwner: address,
    outOwnerBalance: u64,
    reclaimIndex: u64,
})

export interface UpdateUnstakeLockDuration {
    vault: string
    oldValue: bigint
    newValue: bigint
}

export const UpdateUnstakeLockDuration: Codec<UpdateUnstakeLockDuration> = struct({
    vault: address,
    oldValue: u64,
    newValue: u64,
})

export interface UpdateSecondsToFullUnlock {
    vault: string
    oldValue: bigint
    newValue: bigint
}

export const UpdateSecondsToFullUnlock: Codec<UpdateSecondsToFullUnlock> = struct({
    vault: address,
    oldValue: u64,
    newValue: u64,
})
