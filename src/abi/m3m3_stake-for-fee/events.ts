import {event} from '../abi.support'
import {VaultCreated as VaultCreated_, StakeEscrowCreated as StakeEscrowCreated_, ConfigCreated as ConfigCreated_, ConfigClosed as ConfigClosed_, UnstakeCreated as UnstakeCreated_, CancelUnstakeSucceed as CancelUnstakeSucceed_, WithdrawSucceed as WithdrawSucceed_, ClaimFeeSucceed as ClaimFeeSucceed_, FeeEmission as FeeEmission_, AddNewUserToTopHolder as AddNewUserToTopHolder_, RemoveUserFromTopHolder as RemoveUserFromTopHolder_, UserStake as UserStake_, ReclaimIndex as ReclaimIndex_, UpdateUnstakeLockDuration as UpdateUnstakeLockDuration_, UpdateSecondsToFullUnlock as UpdateSecondsToFullUnlock_} from './types'

export type VaultCreated = VaultCreated_

export const VaultCreated = event(
    {
        d8: '0x751978fe4bec4e73',
    },
    VaultCreated_,
)

export type StakeEscrowCreated = StakeEscrowCreated_

export const StakeEscrowCreated = event(
    {
        d8: '0x1ec106f97c7be598',
    },
    StakeEscrowCreated_,
)

export type ConfigCreated = ConfigCreated_

export const ConfigCreated = event(
    {
        d8: '0xc34968a1a6f50478',
    },
    ConfigCreated_,
)

export type ConfigClosed = ConfigClosed_

export const ConfigClosed = event(
    {
        d8: '0x048ad0daccec76c7',
    },
    ConfigClosed_,
)

export type UnstakeCreated = UnstakeCreated_

export const UnstakeCreated = event(
    {
        d8: '0x089412e36ba4eb70',
    },
    UnstakeCreated_,
)

export type CancelUnstakeSucceed = CancelUnstakeSucceed_

export const CancelUnstakeSucceed = event(
    {
        d8: '0x526b459e436d4e93',
    },
    CancelUnstakeSucceed_,
)

export type WithdrawSucceed = WithdrawSucceed_

export const WithdrawSucceed = event(
    {
        d8: '0x0e257acd73279f1c',
    },
    WithdrawSucceed_,
)

export type ClaimFeeSucceed = ClaimFeeSucceed_

export const ClaimFeeSucceed = event(
    {
        d8: '0xfe191d5373bd9012',
    },
    ClaimFeeSucceed_,
)

export type FeeEmission = FeeEmission_

export const FeeEmission = event(
    {
        d8: '0x6d6944568e04731b',
    },
    FeeEmission_,
)

export type AddNewUserToTopHolder = AddNewUserToTopHolder_

export const AddNewUserToTopHolder = event(
    {
        d8: '0xd711c87fe0b472c8',
    },
    AddNewUserToTopHolder_,
)

export type RemoveUserFromTopHolder = RemoveUserFromTopHolder_

export const RemoveUserFromTopHolder = event(
    {
        d8: '0xf4d5bf14f18625eb',
    },
    RemoveUserFromTopHolder_,
)

export type UserStake = UserStake_

export const UserStake = event(
    {
        d8: '0xc3be46e7e84b3397',
    },
    UserStake_,
)

export type ReclaimIndex = ReclaimIndex_

export const ReclaimIndex = event(
    {
        d8: '0x86982ac46b8423de',
    },
    ReclaimIndex_,
)

export type UpdateUnstakeLockDuration = UpdateUnstakeLockDuration_

export const UpdateUnstakeLockDuration = event(
    {
        d8: '0x758610e89118af5f',
    },
    UpdateUnstakeLockDuration_,
)

export type UpdateSecondsToFullUnlock = UpdateSecondsToFullUnlock_

export const UpdateSecondsToFullUnlock = event(
    {
        d8: '0x527d423f4ed17dc4',
    },
    UpdateSecondsToFullUnlock_,
)
