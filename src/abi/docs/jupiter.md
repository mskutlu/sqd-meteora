# Jupiter Aggregator V6 Indexer: Technical Specification

## Overview
This document outlines the technical specification for creating an indexer for the Jupiter Aggregator V6 on Solana, based on the analysis of [src/abi/jupiter_aggregator_v6/instructions.ts](cci:7://file:///Users/msk/sqd/sqd-meteora/src/abi/jupiter_aggregator_v6/instructions.ts:0:0-0:0). The indexer will track key operations related to swaps, liquidity provision, and various DEX interactions.

## Instruction Types

The file defines numerous instruction types for interacting with various DEXes and performing swaps. Here are the main categories:

1. Swap Operations
2. Liquidity Operations
3. Order Book Operations
4. Token Account Management
5. DEX-specific Operations

## Database Models

Based on the instructions defined, we can derive the following database models:

### 1. Swap
Records individual swap transactions across various DEXes.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userAddress | String | Address of the user performing the swap |
| tokenInMint | String | Address of the input token |
| tokenOutMint | String | Address of the output token |
| amountIn | BigInt | Amount of input token |
| amountOut | BigInt | Amount of output token |
| dex | String | Name of the DEX used (e.g., "Orca", "Raydium", "Serum") |
| timestamp | Timestamp | Time of the swap |

**Populated from:** 
Various swap instructions like `orcaSwap`, `raydiumSwap`, `serumSwap`, etc.

### 2. LiquidityAction
Tracks liquidity addition and removal across different protocols.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userAddress | String | Address of the user performing the action |
| poolAddress | String | Address of the liquidity pool |
| tokenAMint | String | Address of token A |
| tokenBMint | String | Address of token B |
| tokenAAmount | BigInt | Amount of token A |
| tokenBAmount | BigInt | Amount of token B |
| actionType | Enum | 'Add' or 'Remove' |
| protocol | String | Name of the protocol (e.g., "Orca", "Raydium") |
| timestamp | Timestamp | Time of the action |

**Populated from:** 
Instructions like `addLiquidity`, `removeLiquidity`, and their variants for different protocols.

### 3. OrderBookAction
Tracks order book related actions on DEXes like Serum.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userAddress | String | Address of the user |
| marketAddress | String | Address of the market |
| actionType | Enum | 'PlaceOrder', 'CancelOrder', 'SettleFunds' |
| side | Enum | 'Buy' or 'Sell' |
| amount | BigInt | Order amount |
| price | BigInt | Order price (if applicable) |
| timestamp | Timestamp | Time of the action |

**Populated from:** 
Instructions like `serumPlaceOrder`, `serumCancelOrder`, `serumSettleFunds`.

### 4. TokenAccountAction
Tracks token account creation and closure.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userAddress | String | Address of the user |
| tokenMint | String | Address of the token mint |
| actionType | Enum | 'Create' or 'Close' |
| timestamp | Timestamp | Time of the action |

**Populated from:** 
Instructions like `createTokenAccount`, `closeTokenAccount`.

### 5. Route
Represents a swap route executed through Jupiter.

| Field | Type | Description |
|-------|------|-------------|
| id | String | Primary key |
| userAddress | String | Address of the user |
| inputMint | String | Address of the input token mint |
| outputMint | String | Address of the output token mint |
| inputAmount | BigInt | Amount of input token |
| outputAmount | BigInt | Amount of output token |
| steps | JSON | Array of swap steps (DEXes used) |
| timestamp | Timestamp | Time of the route execution |

**Populated from:** 
`route` instruction

## Indexing Approach

1. **Instruction Processing**
   - Listen for relevant instructions on the Solana network.
   - Extract necessary data from instruction parameters and account keys.
   - Identify the type of operation from the instruction discriminator.

2. **Database Updates**
   - Create records in the appropriate models based on processed instructions.
   - For complex operations like routes, create related records for each step.

3. **Event Tracking**
   - Track important events like large swaps or significant liquidity changes.
   - Store these events for analytical purposes.

4. **On-demand Calculations**
   - Implement functions to perform calculations when needed, using indexed data.

## Key Calculations

1. **Total Volume**
   - Aggregate swap amounts across all DEXes over time periods.

2. **DEX Usage**
   - Calculate the frequency and volume of swaps for each integrated DEX.

3. **Popular Routes**
   - Analyze common paths taken for token-to-token swaps.

4. **User Activity**
   - Track user engagement across different protocols and actions.

## Implementation Notes

- Use a robust queue system for processing instructions to handle high transaction volumes.
- Implement error handling and retry mechanisms for failed updates.
- Consider implementing a caching layer for frequently accessed data to improve query performance.
- Regularly validate indexed data against on-chain state to ensure accuracy.
- Implement API endpoints for common queries to serve frontend applications efficiently.

## Specific Instructions to Monitor

1. Swap Operations
   - `orcaSwap`, `raydiumSwap`, `serumSwap`, `tokenSwap`, `stepSwap`, `saberSwap`, `saberAddDecimalsSwap`, `saberSwapUnwrap`, `cremaSwap`, `routePlanSwap`, `routeSwap`, `aldrinSwap`, `aldrinV2Swap`, `cropper`, `marinadeDeposit`, `whirlpoolSwap`, `whirlpoolSwapExactOutput`, `lifinity`, `marinade`, `mercurial`, `cykura`, `serum`, `serumV3`, `tokenSwapV2`, `stepTokenSwap`, `routeSwap`, `routePlanSwap`

2. Liquidity Operations
   - `addLiquidity`, `removeLiquidity` (and their variants for different protocols)

3. Order Book Operations
   - `serumPlaceOrder`, `serumCancelOrder`, `serumSettleFunds`

4. Token Account Management
   - `createTokenAccount`, `closeTokenAccount`, `createOpenOrders`

5. Routing
   - `route`

6. Protocol-Specific Operations
   - Various instructions for specific protocols like Mercurial, Aldrin, Cropper, etc.

## Conclusion

This indexer design provides a comprehensive system for tracking the activities of Jupiter Aggregator V6. It captures essential data about swaps, liquidity actions, order book operations, and complex routing across multiple DEXes. The design is flexible enough to accommodate the various operations supported by Jupiter while maintaining a balance between data completeness and storage efficiency. This indexer will enable powerful analytics and insights into the usage patterns of Jupiter Aggregator V6.