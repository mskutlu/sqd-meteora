import {event} from '../abi.support'
import {AddLiquidity as AddLiquidity_, RemoveLiquidity as RemoveLiquidity_, StrategyDeposit as StrategyDeposit_, StrategyWithdraw as StrategyWithdraw_, ClaimReward as ClaimReward_, PerformanceFee as PerformanceFee_, ReportLoss as ReportLoss_, TotalAmount as TotalAmount_} from './types'

export type AddLiquidity = AddLiquidity_

export const AddLiquidity = event(
    {
        d8: '0x1f5e7d5ae3343dba',
    },
    AddLiquidity_,
)

export type RemoveLiquidity = RemoveLiquidity_

export const RemoveLiquidity = event(
    {
        d8: '0x74f461e8671f983a',
    },
    RemoveLiquidity_,
)

export type StrategyDeposit = StrategyDeposit_

export const StrategyDeposit = event(
    {
        d8: '0xcd355bef2288492f',
    },
    StrategyDeposit_,
)

export type StrategyWithdraw = StrategyWithdraw_

export const StrategyWithdraw = event(
    {
        d8: '0x784cd05fddd2e5bd',
    },
    StrategyWithdraw_,
)

export type ClaimReward = ClaimReward_

export const ClaimReward = event(
    {
        d8: '0x947486cc16ab555f',
    },
    ClaimReward_,
)

export type PerformanceFee = PerformanceFee_

export const PerformanceFee = event(
    {
        d8: '0x1c46e7df516defa7',
    },
    PerformanceFee_,
)

export type ReportLoss = ReportLoss_

export const ReportLoss = event(
    {
        d8: '0x9a249ec420a37b7e',
    },
    ReportLoss_,
)

export type TotalAmount = TotalAmount_

export const TotalAmount = event(
    {
        d8: '0x5cc87a91d3cb31cd',
    },
    TotalAmount_,
)
