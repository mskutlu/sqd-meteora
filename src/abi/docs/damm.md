# Dynamic AMM Pools Indexer: Technical Specification

## Overview
This document outlines the technical specification for creating an indexer for the Dynamic AMM Pools on Solana, based on the analysis of [src/abi/dynamic_amm_pools/instructions.ts](cci:7://file:///Users/msk/sqd/sqd-meteora/src/abi/dynamic_amm_pools/instructions.ts:0:0-0:0). The indexer will track key entities and events related to pool creation, liquidity provision, swaps, and other operations.

## Instruction Types

The file defines several instruction types for interacting with Dynamic AMM Pools. Here are the main categories:

1. Pool Initialization
2. Liquidity Operations
3. Swap Operations
4. Pool Management
5. Fee Operations

## Database Models

Based on the instructions defined, we can derive the following database models:

### 1. Pool
Represents a liquidity pool in the Dynamic AMM.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key, derived from pool address |
| lpMint | String | LP token mint address |
| tokenAMint | String | Address of token A |
| tokenBMint | String | Address of token B |
| aVault | String | Vault address for token A |
| bVault | String | Vault address for token B |
| curveType | Enum | Type of curve (e.g., ConstantProduct, Stable) |
| createdAt | Timestamp | Pool creation time |
| updatedAt | Timestamp | Last update time |

**Populated from:** 
- `initializePermissionedPool`
- `initializePermissionlessPool`
- `initializePermissionlessPoolWithFeeTier`

### 2. LiquidityPosition
Represents a user's liquidity position in a pool.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| owner | String | Address of position owner |
| lpTokenAmount | BigInt | Amount of LP tokens held |
| createdAt | Timestamp | Position creation time |
| updatedAt | Timestamp | Last update time |

**Updated by:** 
- `addLiquidity`
- `removeLiquidity`
- `addImbalanceLiquidity`

### 3. Swap
Records individual swap transactions.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| userAddress | String | Address of the user performing the swap |
| tokenInMint | String | Address of the input token |
| tokenOutMint | String | Address of the output token |
| amountIn | BigInt | Amount of input token |
| amountOut | BigInt | Amount of output token |
| timestamp | Timestamp | Time of the swap |

**Populated from:** 
- `swap`

### 4. Fee
Tracks fee-related events.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| feeAmount | BigInt | Amount of fee collected |
| tokenMint | String | Address of the token for the fee |
| timestamp | Timestamp | Time of fee event |

**Related to:** 
- `withdrawFees`

### 5. PoolConfig
Stores configuration parameters for pools.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key, same as pool id |
| poolId | String | Foreign key to Pool |
| tradeFeeNumerator | BigInt | Trade fee numerator |
| tradeFeeDenominator | BigInt | Trade fee denominator |
| ownerTradeFeeNumerator | BigInt | Owner trade fee numerator |
| ownerTradeFeeDenominator | BigInt | Owner trade fee denominator |
| ownerWithdrawFeeNumerator | BigInt | Owner withdraw fee numerator |
| ownerWithdrawFeeDenominator | BigInt | Owner withdraw fee denominator |
| hostFeeNumerator | BigInt | Host fee numerator |
| hostFeeDenominator | BigInt | Host fee denominator |

**Updated by:** 
- `updatePoolConfig`

## Indexing Approach

1. **Instruction Processing**
   - Listen for relevant instructions on the Solana network.
   - Extract necessary data from instruction parameters and account keys.
   - Identify the type of operation from the instruction.

2. **Database Updates**
   - Create or update records in the appropriate models based on processed instructions.
   - Maintain aggregate data (e.g., total liquidity, reserves) in the Pool model.
   - Update LiquidityPosition data for liquidity changes.

3. **Event Tracking**
   - Track important events like pool creation, large swaps, or significant liquidity changes.
   - Store these events for analytical purposes.

4. **On-demand Calculations**
   - Implement functions to perform calculations when needed, using indexed data and on-chain state.

## Key Calculations

1. **Pool Liquidity**
   - Calculate total liquidity by summing LP token amounts across all LiquidityPositions for a pool.

2. **Swap Volume**
   - Aggregate swap amounts over time periods (hourly, daily, weekly).

3. **Fee Accrual**
   - Calculate fees accrued based on swap volume and fee parameters from PoolConfig.

4. **APR/APY for Liquidity Providers**
   - Use fee data and liquidity positions to estimate returns for liquidity providers.

## Implementation Notes

- Use a robust queue system for processing instructions to handle high transaction volumes.
- Implement error handling and retry mechanisms for failed updates or RPC calls.
- Consider implementing a caching layer for frequently accessed on-chain data to reduce RPC load.
- Regularly validate indexed data against on-chain state to ensure accuracy.
- Implement API endpoints for common queries to serve frontend applications efficiently.

## Specific Instructions to Monitor

1. Pool Initialization
   - `initializePermissionedPool`
   - `initializePermissionlessPool`
   - `initializePermissionlessPoolWithFeeTier`

2. Liquidity Operations
   - `addLiquidity`
   - `removeLiquidity`
   - `addImbalanceLiquidity`

3. Swap Operations
   - `swap`

4. Pool Management
   - `updatePoolConfig`
   - `setCustomAttribute`

5. Fee Operations
   - `withdrawFees`

## Conclusion

This indexer design provides a comprehensive system for tracking the activities of Dynamic AMM Pools. It captures essential data about pools, liquidity positions, swaps, and fees, allowing for efficient querying and analysis of the protocol's state and activities. The design is flexible enough to accommodate the various operations supported by the Dynamic AMM Pools while maintaining a balance between data completeness and storage efficiency.