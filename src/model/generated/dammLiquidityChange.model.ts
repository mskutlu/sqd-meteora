import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {DAMMPool} from "./dammPool.model"
import {DAMMLiquidityPosition} from "./dammLiquidityPosition.model"

@Entity_()
export class DAMMLiquidityChange {
    constructor(props?: Partial<DAMMLiquidityChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DAMMPool, {nullable: true})
    pool!: DAMMPool

    @Index_()
    @ManyToOne_(() => DAMMLiquidityPosition, {nullable: true})
    position!: DAMMLiquidityPosition

    @StringColumn_({nullable: false})
    type!: string

    @BigIntColumn_({nullable: false})
    tokenXAmount!: bigint

    @BigIntColumn_({nullable: false})
    tokenYAmount!: bigint

    @BigIntColumn_({nullable: false})
    lpTokenAmount!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
