module.exports = class Data1737749053959 {
    name = 'Data1737749053959'

    async up(db) {
        await db.query(`CREATE TABLE "base_pool" ("id" character varying NOT NULL, "token_x" text NOT NULL, "token_y" text NOT NULL, "token_x_vault" text NOT NULL, "token_y_vault" text NOT NULL, "reserve_x" numeric NOT NULL, "reserve_y" numeric NOT NULL, "total_liquidity" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "status" boolean NOT NULL, CONSTRAINT "PK_eddfb05533fbdd025660778c6a2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "damm_liquidity_position" ("id" character varying NOT NULL, "owner" text NOT NULL, "lp_token_amount" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_a4e8c0293bd9d5626fc20cb30e0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_61db474023f35025de0a0b5761" ON "damm_liquidity_position" ("pool_id") `)
        await db.query(`CREATE TABLE "damm_swap" ("id" character varying NOT NULL, "user_address" text NOT NULL, "token_in_mint" text NOT NULL, "token_out_mint" text NOT NULL, "amount_in" numeric NOT NULL, "amount_out" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_63d51d1f517a5ee39061f02eed8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ecc1250c5dced930de1f4b12c3" ON "damm_swap" ("pool_id") `)
        await db.query(`CREATE TABLE "damm_fee" ("id" character varying NOT NULL, "owner" text NOT NULL, "token_x_amount" numeric NOT NULL, "token_y_amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_f87a179936f3593612410bb8f1c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6dfcdf2c9e0c53622593065055" ON "damm_fee" ("pool_id") `)
        await db.query(`CREATE TABLE "damm_lock" ("id" character varying NOT NULL, "owner" text NOT NULL, "amount" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_eec15bd3f79ae481d4da9dae126" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7982f22675580f8c29dbe77e95" ON "damm_lock" ("pool_id") `)
        await db.query(`CREATE TABLE "damm_liquidity_change" ("id" character varying NOT NULL, "type" text NOT NULL, "token_x_amount" numeric NOT NULL, "token_y_amount" numeric NOT NULL, "lp_token_amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, "position_id" character varying, CONSTRAINT "PK_67bda5c591b015b1ce9072e3f35" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_eea1e177db6ba34da108495701" ON "damm_liquidity_change" ("pool_id") `)
        await db.query(`CREATE INDEX "IDX_a99d0f9244c3b0a0480dd4961f" ON "damm_liquidity_change" ("position_id") `)
        await db.query(`CREATE TABLE "damm_pool" ("id" character varying NOT NULL, "lp_mint" text NOT NULL, "a_vault" text NOT NULL, "b_vault" text NOT NULL, "a_vault_lp_mint" text NOT NULL, "b_vault_lp_mint" text NOT NULL, "curve_type" text NOT NULL, "base_pool_id" character varying, CONSTRAINT "PK_0a66d90f6caa1ebe79052cbc7af" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_14bf1ffa529edfd292278071e4" ON "damm_pool" ("base_pool_id") `)
        await db.query(`CREATE TABLE "dlmm_oracle" ("id" character varying NOT NULL, "length" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "REL_fff801a76a21842007445df1de" UNIQUE ("pool_id"), CONSTRAINT "PK_c4c8c6c9867528894b2f5f7ab1f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE UNIQUE INDEX "IDX_fff801a76a21842007445df1de" ON "dlmm_oracle" ("pool_id") `)
        await db.query(`CREATE TABLE "dlmm_liquidity_change" ("id" character varying NOT NULL, "type" text NOT NULL, "token_x_amount" numeric NOT NULL, "token_y_amount" numeric NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, "position_id" character varying, CONSTRAINT "PK_376b58942eeef91f8e02693ea48" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e6a2223d6ead84b4798c64a3f2" ON "dlmm_liquidity_change" ("pool_id") `)
        await db.query(`CREATE INDEX "IDX_0d271c61c28f5c85794883b000" ON "dlmm_liquidity_change" ("position_id") `)
        await db.query(`CREATE TABLE "dlmm_position" ("id" character varying NOT NULL, "owner" text NOT NULL, "operator" text, "lower_bin_id" integer NOT NULL, "upper_bin_id" integer NOT NULL, "liquidity" numeric NOT NULL, "token_x_amount" numeric NOT NULL, "token_y_amount" numeric NOT NULL, "fee_owner" text, "lock_release_point" numeric, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_f5576a3905c1e055b86cc139ca5" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5eb6e2f567f550ac1412158c9e" ON "dlmm_position" ("pool_id") `)
        await db.query(`CREATE TABLE "dlmm_swap" ("id" character varying NOT NULL, "user_address" text NOT NULL, "token_in_address" text NOT NULL, "token_out_address" text NOT NULL, "amount_in" numeric NOT NULL, "amount_out" numeric NOT NULL, "price_impact_bps" integer, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_9cf1e361973f3c0f9d7e86ef8f2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_9ec5ebbb8356e5f43589047fc7" ON "dlmm_swap" ("pool_id") `)
        await db.query(`CREATE TABLE "dlmm_reward" ("id" character varying NOT NULL, "reward_index" integer NOT NULL, "reward_duration" numeric NOT NULL, "funder" text NOT NULL, "amount" numeric NOT NULL, "last_update_time" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_ced7090955778603dde1b17ac59" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a2b84415c94c762f82d06b363d" ON "dlmm_reward" ("pool_id") `)
        await db.query(`CREATE TABLE "dlmm_bin_array" ("id" character varying NOT NULL, "index" numeric NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "pool_id" character varying, CONSTRAINT "PK_cf803abda9fd8b53a45351a249a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ad6f716e7d149bf1b6e60bd09e" ON "dlmm_bin_array" ("pool_id") `)
        await db.query(`CREATE TABLE "dlmm_pool" ("id" character varying NOT NULL, "bin_step" integer NOT NULL, "active_id" integer NOT NULL, "activation_point" numeric, "pre_activation_duration" numeric, "pre_activation_swap_address" text, "base_pool_id" character varying, CONSTRAINT "PK_2d2a83e1e4ee59b5d7e139038ee" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a3fa4326aadf455c3dbbc72980" ON "dlmm_pool" ("base_pool_id") `)
        await db.query(`ALTER TABLE "damm_liquidity_position" ADD CONSTRAINT "FK_61db474023f35025de0a0b57618" FOREIGN KEY ("pool_id") REFERENCES "damm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_swap" ADD CONSTRAINT "FK_ecc1250c5dced930de1f4b12c34" FOREIGN KEY ("pool_id") REFERENCES "damm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_fee" ADD CONSTRAINT "FK_6dfcdf2c9e0c53622593065055a" FOREIGN KEY ("pool_id") REFERENCES "damm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_lock" ADD CONSTRAINT "FK_7982f22675580f8c29dbe77e95a" FOREIGN KEY ("pool_id") REFERENCES "damm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_liquidity_change" ADD CONSTRAINT "FK_eea1e177db6ba34da108495701a" FOREIGN KEY ("pool_id") REFERENCES "damm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_liquidity_change" ADD CONSTRAINT "FK_a99d0f9244c3b0a0480dd4961fd" FOREIGN KEY ("position_id") REFERENCES "damm_liquidity_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "damm_pool" ADD CONSTRAINT "FK_14bf1ffa529edfd292278071e45" FOREIGN KEY ("base_pool_id") REFERENCES "base_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_oracle" ADD CONSTRAINT "FK_fff801a76a21842007445df1de3" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_liquidity_change" ADD CONSTRAINT "FK_e6a2223d6ead84b4798c64a3f26" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_liquidity_change" ADD CONSTRAINT "FK_0d271c61c28f5c85794883b0005" FOREIGN KEY ("position_id") REFERENCES "dlmm_position"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_position" ADD CONSTRAINT "FK_5eb6e2f567f550ac1412158c9e0" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_swap" ADD CONSTRAINT "FK_9ec5ebbb8356e5f43589047fc7b" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_reward" ADD CONSTRAINT "FK_a2b84415c94c762f82d06b363d4" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_bin_array" ADD CONSTRAINT "FK_ad6f716e7d149bf1b6e60bd09ef" FOREIGN KEY ("pool_id") REFERENCES "dlmm_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "dlmm_pool" ADD CONSTRAINT "FK_a3fa4326aadf455c3dbbc72980a" FOREIGN KEY ("base_pool_id") REFERENCES "base_pool"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "base_pool"`)
        await db.query(`DROP TABLE "damm_liquidity_position"`)
        await db.query(`DROP INDEX "public"."IDX_61db474023f35025de0a0b5761"`)
        await db.query(`DROP TABLE "damm_swap"`)
        await db.query(`DROP INDEX "public"."IDX_ecc1250c5dced930de1f4b12c3"`)
        await db.query(`DROP TABLE "damm_fee"`)
        await db.query(`DROP INDEX "public"."IDX_6dfcdf2c9e0c53622593065055"`)
        await db.query(`DROP TABLE "damm_lock"`)
        await db.query(`DROP INDEX "public"."IDX_7982f22675580f8c29dbe77e95"`)
        await db.query(`DROP TABLE "damm_liquidity_change"`)
        await db.query(`DROP INDEX "public"."IDX_eea1e177db6ba34da108495701"`)
        await db.query(`DROP INDEX "public"."IDX_a99d0f9244c3b0a0480dd4961f"`)
        await db.query(`DROP TABLE "damm_pool"`)
        await db.query(`DROP INDEX "public"."IDX_14bf1ffa529edfd292278071e4"`)
        await db.query(`DROP TABLE "dlmm_oracle"`)
        await db.query(`DROP INDEX "public"."IDX_fff801a76a21842007445df1de"`)
        await db.query(`DROP TABLE "dlmm_liquidity_change"`)
        await db.query(`DROP INDEX "public"."IDX_e6a2223d6ead84b4798c64a3f2"`)
        await db.query(`DROP INDEX "public"."IDX_0d271c61c28f5c85794883b000"`)
        await db.query(`DROP TABLE "dlmm_position"`)
        await db.query(`DROP INDEX "public"."IDX_5eb6e2f567f550ac1412158c9e"`)
        await db.query(`DROP TABLE "dlmm_swap"`)
        await db.query(`DROP INDEX "public"."IDX_9ec5ebbb8356e5f43589047fc7"`)
        await db.query(`DROP TABLE "dlmm_reward"`)
        await db.query(`DROP INDEX "public"."IDX_a2b84415c94c762f82d06b363d"`)
        await db.query(`DROP TABLE "dlmm_bin_array"`)
        await db.query(`DROP INDEX "public"."IDX_ad6f716e7d149bf1b6e60bd09e"`)
        await db.query(`DROP TABLE "dlmm_pool"`)
        await db.query(`DROP INDEX "public"."IDX_a3fa4326aadf455c3dbbc72980"`)
        await db.query(`ALTER TABLE "damm_liquidity_position" DROP CONSTRAINT "FK_61db474023f35025de0a0b57618"`)
        await db.query(`ALTER TABLE "damm_swap" DROP CONSTRAINT "FK_ecc1250c5dced930de1f4b12c34"`)
        await db.query(`ALTER TABLE "damm_fee" DROP CONSTRAINT "FK_6dfcdf2c9e0c53622593065055a"`)
        await db.query(`ALTER TABLE "damm_lock" DROP CONSTRAINT "FK_7982f22675580f8c29dbe77e95a"`)
        await db.query(`ALTER TABLE "damm_liquidity_change" DROP CONSTRAINT "FK_eea1e177db6ba34da108495701a"`)
        await db.query(`ALTER TABLE "damm_liquidity_change" DROP CONSTRAINT "FK_a99d0f9244c3b0a0480dd4961fd"`)
        await db.query(`ALTER TABLE "damm_pool" DROP CONSTRAINT "FK_14bf1ffa529edfd292278071e45"`)
        await db.query(`ALTER TABLE "dlmm_oracle" DROP CONSTRAINT "FK_fff801a76a21842007445df1de3"`)
        await db.query(`ALTER TABLE "dlmm_liquidity_change" DROP CONSTRAINT "FK_e6a2223d6ead84b4798c64a3f26"`)
        await db.query(`ALTER TABLE "dlmm_liquidity_change" DROP CONSTRAINT "FK_0d271c61c28f5c85794883b0005"`)
        await db.query(`ALTER TABLE "dlmm_position" DROP CONSTRAINT "FK_5eb6e2f567f550ac1412158c9e0"`)
        await db.query(`ALTER TABLE "dlmm_swap" DROP CONSTRAINT "FK_9ec5ebbb8356e5f43589047fc7b"`)
        await db.query(`ALTER TABLE "dlmm_reward" DROP CONSTRAINT "FK_a2b84415c94c762f82d06b363d4"`)
        await db.query(`ALTER TABLE "dlmm_bin_array" DROP CONSTRAINT "FK_ad6f716e7d149bf1b6e60bd09ef"`)
        await db.query(`ALTER TABLE "dlmm_pool" DROP CONSTRAINT "FK_a3fa4326aadf455c3dbbc72980a"`)
    }
}
