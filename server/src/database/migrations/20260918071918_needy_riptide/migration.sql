CREATE TYPE "wallet_status" AS ENUM('activate', 'closed', 'suspended');--> statement-breakpoint
CREATE TABLE "wallets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"userId" uuid NOT NULL,
	"currency" varchar(3) DEFAULT 'VND' NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"status" "wallet_status" DEFAULT 'activate'::"wallet_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "wallets" ADD CONSTRAINT "wallets_userId_users_id_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id");