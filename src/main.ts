import {TypeormDatabase} from '@subsquid/typeorm-store'
import {augmentBlock} from '@subsquid/solana-objects'
import {DataSourceBuilder, SolanaRpcClient} from '@subsquid/solana-stream'
import * as damm from './abi/damm'
import * as dlmm from './abi/dlmm'
import { DammProcessor } from './damm/processor'
import { DlmmProcessor } from './dlmm/processor'
import {run} from '@subsquid/batch-processor'
import {decodeTokenTransfers, decodeTokenTransfersChecked, getAccountByIndex, writeLayoutLog, writeLog} from "./utils";

const database = new TypeormDatabase()

const dataSource = new DataSourceBuilder()
    .setGateway('https://v2.archive.subsquid.io/network/solana-mainnet')
    .setRpc(process.env.SOLANA_NODE == null ? undefined : {
        client: new SolanaRpcClient({
            url: process.env.SOLANA_NODE,
            // rateLimit: 100 // requests per sec
        }),
        strideConcurrency: 10
    })
    .setBlockRange({from: 259_984_950})
    // .setBlockRange({from: 290987855, to: 290997876})
    // .setBlockRange({from: 269893072, to: 276165841})
    .setFields({
        block: { // block header fields
            timestamp: true
        },
        transaction: { // transaction fields
            signatures: true
        },
        instruction: { // instruction fields
            programId: true,
            accounts: true,
            data: true
        },
        tokenBalance: { // token balance record fields
            preAmount: true,
            postAmount: true,
            preOwner: true,
            postOwner: true
        }
    })
    .addInstruction({
      where: {
        programId: [damm.programId],
        // d8: [
        //   // damm.instructions.initializePermissionedPool.d8,
        //   // damm.instructions.initializePermissionlessPool.d8,
        //   //   damm.instructions.initializeCustomizablePermissionlessConstantProductPool.d8,
        //   //   damm.instructions.initializePermissionlessConstantProductPoolWithConfig.d8,
        //   //   damm.instructions.initializePermissionlessPoolWithFeeTier.d8,
        //   // damm.instructions.swap.d8,
        //   // damm.instructions.addBalanceLiquidity.d8,
        //   // damm.instructions.removeBalanceLiquidity.d8,
        //   // damm.instructions.setPoolFees.d8
        // ],
        isCommitted: true
      },
      include: {
        innerInstructions: true,
        transaction: true,
        transactionTokenBalances: true
      }
    })
    .addInstruction({
      where: {
        programId: [dlmm.programId],
        isCommitted: true
      },
      include: {
        innerInstructions: true,
        transaction: true,
        transactionTokenBalances: true
      }
    })
    .build()

run(dataSource, database, async ctx => {
  let blocks = ctx.blocks.map(augmentBlock)
  const dammProcessor = new DammProcessor(ctx as any)
  const dlmmProcessor = new DlmmProcessor(ctx as any)

  for (let block of blocks) {
    for (let ins of block.instructions) {
      try {
        const poolAddress = getAccountByIndex(ins.accounts, 0)
        // if (poolAddress.toLowerCase() === 'Es2vtGnR5afH3LQMPVeuZwFzj4HmQK4RezUVLoykom4G'.toLowerCase()) {
        // Process DAMM instructions
          if (ins.programId === damm.programId) {
              const transfers = decodeTokenTransfers(ins)
              writeLayoutLog('damm', ins.d8, {ins: ins, transfers: transfers, inner: ins.inner})

               await dammProcessor.processInstruction(ins, block.header.timestamp)
          }
          // Process DLMM instructions
          if (ins.programId === dlmm.programId) {
              const layout = Object.values(dlmm.instructions).find(i => i.d8 === ins.d8)
              if (layout) {
                  const decoded = layout.decode({
                      data: ins.data,
                      accounts: ins.accounts
                  })
                  const transfers = decodeTokenTransfersChecked(ins)
                  writeLayoutLog('dlmm', ins.d8, {block: block, ins: ins, transfers: transfers, inner: ins.inner, decoded: decoded})
              }
              await dlmmProcessor.processInstruction(ins, block.header.timestamp)
          }

          // }
      } catch (error: any) {
          const layout = Object.values(damm.instructions).find(i => i.d8 === ins.d8)
          // @ts-ignore
          const decoded = layout.decode({
              data: ins.data,
              accounts: ins.accounts
          })
      }
    }
  }
  
  try {
    // Get all stored records from DAMM
    const dammBasePools = dammProcessor.getAllStoredBasePools()
    const dammPools = dammProcessor.getAllStoredPools()
    const dammPositions = dammProcessor.getAllStoredPositions()
    const dammSwaps = dammProcessor.getAllStoredSwaps()
    const dammLiquidityChanges = dammProcessor.getAllStoredLiquidityChanges()
    const dammFees = dammProcessor.getAllStoredFees()
    const dammLocks = dammProcessor.getAllStoredLocks()

    // Get all stored records from DLMM
    const dlmmBasePools = dlmmProcessor.getAllStoredBasePools()
    const dlmmPools = dlmmProcessor.getAllStoredPools()
    const dlmmPositions = dlmmProcessor.getAllStoredPositions()
    const dlmmSwaps = dlmmProcessor.getAllStoredSwaps()
    const dlmmLiquidityChanges = dlmmProcessor.getAllStoredLiquidityChanges()
    const dlmmRewards = dlmmProcessor.getAllStoredRewards()
    const dlmmFees = dlmmProcessor.getAllStoredFees()

    console.log(`Writing DAMM: ${dammPools.length} pools, ${dammPositions.length} positions, ${dammSwaps.length} swaps, ${dammBasePools.length} base pools, ${dammLiquidityChanges.length} liquidity changes, ${dammFees.length} fees, and ${dammLocks.length} locks`)
    console.log(`Writing DLMM: ${dlmmPools.length} pools, ${dlmmPositions.length} positions, ${dlmmSwaps.length} swaps, ${dlmmBasePools.length} base pools, ${dlmmLiquidityChanges.length} liquidity changes, ${dlmmRewards.length} rewards, ${dlmmFees.length} fees`)

    // Save DAMM records in order of dependencies
    await ctx.store.save(dammBasePools)
    await ctx.store.save(dammPools)
    await ctx.store.save(dammPositions)
    await ctx.store.save(dammSwaps)
    await ctx.store.save(dammLiquidityChanges)
    await ctx.store.save(dammFees)
    await ctx.store.save(dammLocks)

    // Save DLMM records in order of dependencies
    await ctx.store.save(dlmmBasePools)
    await ctx.store.save(dlmmPools)
    await ctx.store.save(dlmmPositions)
    await ctx.store.save(dlmmSwaps)
    await ctx.store.save(dlmmLiquidityChanges)
    await ctx.store.save(dlmmRewards)
    await ctx.store.save(dlmmFees)

  } catch (error: any) {
    console.error('Failed to save entities:', error)
    throw error
  }
})
