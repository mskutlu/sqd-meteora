import {event} from '../abi.support'
import {ProrataVaultCreated as ProrataVaultCreated_, FcfsVaultCreated as FcfsVaultCreated_, EscrowCreated as EscrowCreated_, MerkleRootConfigCreated as MerkleRootConfigCreated_, ProrataVaultParametersUpdated as ProrataVaultParametersUpdated_, FcfsVaultParametersUpdated as FcfsVaultParametersUpdated_, EscrowRemainingWithdraw as EscrowRemainingWithdraw_, EscrowWithdraw as EscrowWithdraw_, SwapFill as SwapFill_, EscrowDeposit as EscrowDeposit_, EscrowClosed as EscrowClosed_, EscrowClaimToken as EscrowClaimToken_} from './types'

export type ProrataVaultCreated = ProrataVaultCreated_

export const ProrataVaultCreated = event(
    {
        d8: '0xb5ffa2e2cbc7c106',
    },
    ProrataVaultCreated_,
)

export type FcfsVaultCreated = FcfsVaultCreated_

export const FcfsVaultCreated = event(
    {
        d8: '0x4999a56797b6b888',
    },
    FcfsVaultCreated_,
)

export type EscrowCreated = EscrowCreated_

export const EscrowCreated = event(
    {
        d8: '0x467f69665c6107ad',
    },
    EscrowCreated_,
)

export type MerkleRootConfigCreated = MerkleRootConfigCreated_

export const MerkleRootConfigCreated = event(
    {
        d8: '0x79702a4c90838e5a',
    },
    MerkleRootConfigCreated_,
)

export type ProrataVaultParametersUpdated = ProrataVaultParametersUpdated_

export const ProrataVaultParametersUpdated = event(
    {
        d8: '0x1893a0ed84570fce',
    },
    ProrataVaultParametersUpdated_,
)

export type FcfsVaultParametersUpdated = FcfsVaultParametersUpdated_

export const FcfsVaultParametersUpdated = event(
    {
        d8: '0x4e70703ec1d1e7e2',
    },
    FcfsVaultParametersUpdated_,
)

export type EscrowRemainingWithdraw = EscrowRemainingWithdraw_

export const EscrowRemainingWithdraw = event(
    {
        d8: '0x710e9c59714f58b2',
    },
    EscrowRemainingWithdraw_,
)

export type EscrowWithdraw = EscrowWithdraw_

export const EscrowWithdraw = event(
    {
        d8: '0xab11a4747a42b722',
    },
    EscrowWithdraw_,
)

export type SwapFill = SwapFill_

export const SwapFill = event(
    {
        d8: '0x74d449de21f48694',
    },
    SwapFill_,
)

export type EscrowDeposit = EscrowDeposit_

export const EscrowDeposit = event(
    {
        d8: '0x2b5a31b086943220',
    },
    EscrowDeposit_,
)

export type EscrowClosed = EscrowClosed_

export const EscrowClosed = event(
    {
        d8: '0x6d143933d97603ad',
    },
    EscrowClosed_,
)

export type EscrowClaimToken = EscrowClaimToken_

export const EscrowClaimToken = event(
    {
        d8: '0xb348471e3b13aa03',
    },
    EscrowClaimToken_,
)
