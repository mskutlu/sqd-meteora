# Meteora DEX Indexer: Technical Specification

## Overview
This document outlines the technical specification for creating an indexer for the Meteora DEX on Solana. The indexer will track key entities and events without storing granular bin data, instead relying on on-chain state for bin-specific information.

## Database Models

### 1. Pool
Represents a liquidity pool in the Meteora DEX.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key, derived from lbPair address |
| tokenX | String | Address of token X |
| tokenY | String | Address of token Y |
| reserveX | BigInt | Amount of token X in the pool |
| reserveY | BigInt | Amount of token Y in the pool |
| binStep | Integer | Step size between bins |
| activeId | Integer | Current active bin ID |
| totalLiquidity | BigInt | Total liquidity in the pool |
| createdAt | Timestamp | Pool creation time |
| updatedAt | Timestamp | Last update time |

**Populated from:** 
- `initializeLbPair`
- `initializePermissionLbPair`
- `initializeCustomizablePermissionlessLbPair`

**Updated by:** 
- Liquidity change operations
- Swap operations

### 2. Position
Represents a user's liquidity position in a pool.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key, position address |
| poolId | String | Foreign key to Pool |
| owner | String | Address of position owner |
| lowerBinId | Integer | Lower bound of position's bin range |
| upperBinId | Integer | Upper bound of position's bin range |
| liquidity | BigInt | Total liquidity provided |
| tokenXAmount | BigInt | Amount of token X in position |
| tokenYAmount | BigInt | Amount of token Y in position |
| createdAt | Timestamp | Position creation time |
| updatedAt | Timestamp | Last update time |

**Populated from:** 
- `initializePosition`
- `initializePositionPda`
- `initializePositionByOperator`

**Updated by:** 
- Liquidity change operations

### 3. LiquidityChange
Tracks liquidity additions and removals.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| positionId | String | Foreign key to Position |
| type | Enum | 'add' or 'remove' |
| tokenXAmount | BigInt | Amount of token X added/removed |
| tokenYAmount | BigInt | Amount of token Y added/removed |
| timestamp | Timestamp | Time of the liquidity change |

**Populated from:** 
- `addLiquidity`
- `addLiquidityByWeight`
- `addLiquidityByStrategy`
- `addLiquidityByStrategyOneSide`
- `AddLiquidityOneSidePrecise`
- `addLiquidityOneSide`
- `removeLiquidity`
- `removeAllLiquidity`
- `removeLiquidityByRange`

### 4. Swap
Records individual swap transactions.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| userAddress | String | Address of the user performing the swap |
| tokenInAddress | String | Address of the input token |
| tokenOutAddress | String | Address of the output token |
| amountIn | BigInt | Amount of input token |
| amountOut | BigInt | Amount of output token |
| timestamp | Timestamp | Time of the swap |

**Populated from:** 
- `swap`
- `swapExactOut`
- `swapWithPriceImpact`

### 5. Reward
Tracks reward configurations for pools.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| rewardMint | String | Address of reward token |
| rewardVault | String | Address of reward vault |
| rewardIndex | Integer | Index of the reward |
| rewardDuration | BigInt | Duration of the reward period |
| funder | String | Address of reward funder |

**Populated from:** 
- `initializeReward`
- `fundReward`
- `updateRewardFunder`
- `updateRewardDuration`

### 6. Fee
Records fee collection events.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| poolId | String | Foreign key to Pool |
| feeAmount | BigInt | Amount of fee collected |
| tokenAddress | String | Address of the token for the fee |
| timestamp | Timestamp | Time of fee collection |

**Populated from:** 
- `withdrawProtocolFee`

## Indexing Approach

1. **Instruction Processing**
   - Listen for relevant instructions on the Solana network.
   - Extract necessary data from instruction parameters and account keys.
   - Identify the type of operation (e.g., swap, liquidity change) from the instruction.

2. **Database Updates**
   - Create or update records in the appropriate models based on processed instructions.
   - Maintain aggregate data (e.g., total liquidity, reserves) in the Pool model.
   - Update Position data for liquidity changes.

3. **Bin Data Handling**
   - Do not store individual bin data in the database.
   - Use bin information from instructions to update aggregate data (e.g., position liquidity, pool total liquidity).
   - When bin-specific data is needed, query on-chain state accounts directly.

4. **On-demand Calculations**
   - Implement functions to perform bin-related calculations when needed, using current on-chain state and indexed data.
   - Cache frequently accessed on-chain data to reduce RPC calls, with a short TTL to ensure data freshness.

## Key Calculations

1. **Current Pool Price**
   - Calculate using `activeId` and `binStep` from the Pool model.
   - Formula: `price = 1.0001^(activeId * binStep)`

2. **Liquidity Distribution**
   - Query on-chain state for bin liquidity data.
   - Aggregate liquidity across bins to show distribution.

3. **Effective Liquidity for Swaps**
   - Calculate based on current price and nearby bin liquidity.
   - Requires querying on-chain state for detailed bin data.

4. **APR/APY for Positions**
   - Use fee and reward data to calculate returns.
   - Consider position's liquidity and time range.

5. **Volume and Liquidity Trends**
   - Aggregate swap and liquidity change data over time periods.
   - Store periodic snapshots for efficient historical queries.

## Implementation Notes

- Use a robust queue system for processing instructions to handle high transaction volumes.
- Implement error handling and retry mechanisms for failed updates or RPC calls.
- Consider implementing a caching layer for frequently accessed on-chain data to reduce RPC load.
- Regularly validate indexed data against on-chain state to ensure accuracy.
- Implement API endpoints for common queries to serve frontend applications efficiently.

## Conclusion

This indexer design provides a balance between maintaining essential historical data and leveraging on-chain state for detailed, current information. It allows for efficient tracking of Meteora DEX activities while minimizing storage requirements and maintaining flexibility for complex calculations.