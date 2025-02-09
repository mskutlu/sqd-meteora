import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {DLMMPool} from "./dlmmPool.model"
import {DLMMPosition} from "./dlmmPosition.model"

@Entity_()
export class DLMMLiquidityChange {
    constructor(props?: Partial<DLMMLiquidityChange>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DLMMPool, {nullable: true})
    pool!: DLMMPool

    @Index_()
    @ManyToOne_(() => DLMMPosition, {nullable: true})
    position!: DLMMPosition

    @StringColumn_({nullable: false})
    type!: string

    @BigIntColumn_({nullable: false})
    tokenXAmount!: bigint

    @BigIntColumn_({nullable: false})
    tokenYAmount!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
