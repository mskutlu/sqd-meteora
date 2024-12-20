#!/bin/bash

# Directory for ABI files
ABI_DIR="src/abi"

# Create the ABI directory if it doesn't exist
mkdir -p "$ABI_DIR"

# Function to generate types
generate_types() {
    local program="$1"
    local id="$2"
    echo "Generating types for $program..."
    npx squid-solana-typegen "$ABI_DIR" "$id#$program"
}

# Generate types for each program
generate_types "dlmm" "LBUZKhRxPF3XUpBCjp4YzTKgLccjZhTSDM9YuVaPwxo"
generate_types "dynamic_amm_pools" "Eo7WjKq67rjJQSZxS6z3YkapzY3eMj6Xy8X5EQVn5UaB"
generate_types "m3m3_stake-for-fee" "FEESngU3neckdwib9X3KWqdL7Mjmqk9XNp3uh5JbP4KP"
generate_types "vault" "24Uqj9JCLxUeoC3hGfh5W3s9FM9uCHDS2SG3LYwBpyTi"
generate_types "farm" "FarmuwXPWXvefWUeqFAa5w6rifLkq5X6E8bimYvrhCB1"
generate_types "token" "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
generate_types "associated_token_account" "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL"
generate_types "meteora_dlmm_vault" "vaU6kP7iNEGkbmPkLmZfGwiGxd4Mob24QQCie5R9kd2"
generate_types "system" "11111111111111111111111111111111"
generate_types "compute_budget" "ComputeBudget111111111111111111111111111111"
generate_types "metaplex_token_metadata" "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
generate_types "jupiter_aggregator_v6" "JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4"
generate_types "affiliate" "GacY9YuN16HNRTy7ZWwULPccwvfFSBeNLuAQP7y38Du3"
generate_types "mercurial_stable_swap" "MERLuDFBMmsHnsBPZw2sDQZHvXFMwp8EdjudcU2HKky"

echo "Type generation complete!"