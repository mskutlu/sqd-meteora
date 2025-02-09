import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, StringColumn as StringColumn_, BigIntColumn as BigIntColumn_, DateTimeColumn as DateTimeColumn_, BooleanColumn as BooleanColumn_} from "@subsquid/typeorm-store"

@Entity_()
export class BasePool {
    constructor(props?: Partial<BasePool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @StringColumn_({nullable: false})
    tokenX!: string

    @StringColumn_({nullable: false})
    tokenY!: string

    @StringColumn_({nullable: false})
    tokenXVault!: string

    @StringColumn_({nullable: false})
    tokenYVault!: string

    @BigIntColumn_({nullable: false})
    reserveX!: bigint

    @BigIntColumn_({nullable: false})
    reserveY!: bigint

    @BigIntColumn_({nullable: false})
    totalLiquidity!: bigint

    @DateTimeColumn_({nullable: false})
    createdAt!: Date

    @DateTimeColumn_({nullable: false})
    updatedAt!: Date

    @BooleanColumn_({nullable: false})
    status!: boolean
}
