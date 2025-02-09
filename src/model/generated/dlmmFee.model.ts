import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, IntColumn as IntColumn_} from "@subsquid/typeorm-store"
import {DLMMPool} from "./dlmmPool.model"

@Entity_()
export class DlmmFee {
    constructor(props?: Partial<DlmmFee>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DLMMPool, {nullable: true})
    pool!: DLMMPool

    @StringColumn_({nullable: false})
    position!: string

    @StringColumn_({nullable: false})
    user!: string

    @BigIntColumn_({nullable: false})
    amountX!: bigint

    @BigIntColumn_({nullable: false})
    amountY!: bigint

    @StringColumn_({nullable: false})
    type!: string

    @IntColumn_({nullable: false})
    timestamp!: number
}
