import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {BasePool} from "./basePool.model"
import {DLMMPosition} from "./dlmmPosition.model"
import {DLMMSwap} from "./dlmmSwap.model"
import {DLMMLiquidityChange} from "./dlmmLiquidityChange.model"
import {DLMMReward} from "./dlmmReward.model"
import {DlmmFee} from "./dlmmFee.model"

@Entity_()
export class DLMMPool {
    constructor(props?: Partial<DLMMPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => BasePool, {nullable: true})
    basePool!: BasePool

    @IntColumn_({nullable: false})
    binStep!: number

    @IntColumn_({nullable: false})
    activeId!: number

    @BigIntColumn_({nullable: true})
    activationPoint!: bigint | undefined | null

    @BigIntColumn_({nullable: true})
    preActivationDuration!: bigint | undefined | null

    @StringColumn_({nullable: true})
    preActivationSwapAddress!: string | undefined | null

    @OneToMany_(() => DLMMPosition, e => e.pool)
    positions!: DLMMPosition[]

    @OneToMany_(() => DLMMSwap, e => e.pool)
    swaps!: DLMMSwap[]

    @OneToMany_(() => DLMMLiquidityChange, e => e.pool)
    liquidityChanges!: DLMMLiquidityChange[]

    @OneToMany_(() => DLMMReward, e => e.pool)
    rewards!: DLMMReward[]

    @OneToMany_(() => DlmmFee, e => e.pool)
    fees!: DlmmFee[]
}
