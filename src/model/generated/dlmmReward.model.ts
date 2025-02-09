import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, IntColumn as IntColumn_, BigIntColumn as BigIntColumn_, StringColumn as StringColumn_, DateTimeColumn as DateTimeColumn_} from "@subsquid/typeorm-store"
import {DLMMPool} from "./dlmmPool.model"

@Entity_()
export class DLMMReward {
    constructor(props?: Partial<DLMMReward>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => DLMMPool, {nullable: true})
    pool!: DLMMPool

    @IntColumn_({nullable: false})
    rewardIndex!: number

    @BigIntColumn_({nullable: false})
    rewardDuration!: bigint

    @StringColumn_({nullable: false})
    funder!: string

    @BigIntColumn_({nullable: false})
    amount!: bigint

    @DateTimeColumn_({nullable: false})
    lastUpdateTime!: Date

    @DateTimeColumn_({nullable: false})
    createdAt!: Date
}
