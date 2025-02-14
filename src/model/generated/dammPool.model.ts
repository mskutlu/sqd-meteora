import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_, StringColumn as StringColumn_, OneToMany as OneToMany_} from "@subsquid/typeorm-store"
import {BasePool} from "./basePool.model"
import {DAMMLiquidityPosition} from "./dammLiquidityPosition.model"
import {DAMMSwap} from "./dammSwap.model"
import {DAMMFee} from "./dammFee.model"
import {DAMMLock} from "./dammLock.model"
import {DAMMLiquidityChange} from "./dammLiquidityChange.model"

@Entity_()
export class DAMMPool {
    constructor(props?: Partial<DAMMPool>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => BasePool, {nullable: true})
    basePool!: BasePool

    @StringColumn_({nullable: false})
    aVault!: string

    @StringColumn_({nullable: false})
    bVault!: string

    @StringColumn_({nullable: false})
    aVaultLpMint!: string

    @StringColumn_({nullable: false})
    bVaultLpMint!: string

    @StringColumn_({nullable: false})
    curveType!: string

    @OneToMany_(() => DAMMLiquidityPosition, e => e.pool)
    positions!: DAMMLiquidityPosition[]

    @OneToMany_(() => DAMMSwap, e => e.pool)
    swaps!: DAMMSwap[]

    @OneToMany_(() => DAMMFee, e => e.pool)
    fees!: DAMMFee[]

    @OneToMany_(() => DAMMLock, e => e.pool)
    locks!: DAMMLock[]

    @OneToMany_(() => DAMMLiquidityChange, e => e.pool)
    liquidityChanges!: DAMMLiquidityChange[]
}
