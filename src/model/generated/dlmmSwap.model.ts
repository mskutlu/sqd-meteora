import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {DLMMPool} from "./dlmmPool.model"

@Entity_()
export class DLMMSwap {
    constructor(props?: Partial<DLMMSwap>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DLMMPool, {nullable: true})
    pool!: DLMMPool

    @StringColumn_({nullable: false})
    userAddress!: string

    @StringColumn_({nullable: false})
    tokenInAddress!: string

    @StringColumn_({nullable: false})
    tokenOutAddress!: string

    @BigIntColumn_({nullable: false})
    amountIn!: bigint

    @BigIntColumn_({nullable: false})
    amountOut!: bigint

    @IntColumn_({nullable: true})
    priceImpactBps!: number | undefined | null

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
