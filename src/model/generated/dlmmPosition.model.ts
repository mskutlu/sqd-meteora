import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {DLMMPool} from "./dlmmPool.model"
import {DLMMLiquidityChange} from "./dlmmLiquidityChange.model"

@Entity_()
export class DLMMPosition {
    constructor(props?: Partial<DLMMPosition>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DLMMPool, {nullable: true})
    pool!: DLMMPool

    @StringColumn_({nullable: false})
    owner!: string

    @StringColumn_({nullable: true})
    operator!: string | undefined | null

    @IntColumn_({nullable: false})
    lowerBinId!: number

    @IntColumn_({nullable: false})
    upperBinId!: number

    @BigIntColumn_({nullable: false})
    liquidity!: bigint

    @BigIntColumn_({nullable: false})
    tokenXAmount!: bigint

    @BigIntColumn_({nullable: false})
    tokenYAmount!: bigint

    @StringColumn_({nullable: true})
    feeOwner!: string | undefined | null

    @BigIntColumn_({nullable: true})
    lockReleasePoint!: bigint | undefined | null

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @OneToMany_(() => DLMMLiquidityChange, e => e.position)
    liquidityChanges!: DLMMLiquidityChange[]
}
