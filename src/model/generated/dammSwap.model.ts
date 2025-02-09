import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {DAMMPool} from "./dammPool.model"

@Entity_()
export class DAMMSwap {
    constructor(props?: Partial<DAMMSwap>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DAMMPool, {nullable: true})
    pool!: DAMMPool

    @StringColumn_({nullable: false})
    userAddress!: string

    @StringColumn_({nullable: false})
    tokenInMint!: string

    @StringColumn_({nullable: false})
    tokenOutMint!: string

    @BigIntColumn_({nullable: false})
    amountIn!: bigint

    @BigIntColumn_({nullable: false})
    amountOut!: bigint

    @DateTimeColumn_({nullable: false})
    timestamp!: Date
}
