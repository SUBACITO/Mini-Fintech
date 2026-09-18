CREATE TYPE "transfer_status" AS ENUM('pending', 'failed', 'completed', 'cancelled');--> statement-breakpoint
CREATE TABLE "transfers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sender_wallet_id" uuid NOT NULL,
	"receiver_wallet_id" uuid NOT NULL,
	"balance" bigint DEFAULT 0 NOT NULL,
	"status" "transfer_status" DEFAULT 'pending'::"transfer_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_sender_wallet_id_wallets_id_fkey" FOREIGN KEY ("sender_wallet_id") REFERENCES "wallets"("id");--> statement-breakpoint
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_receiver_wallet_id_wallets_id_fkey" FOREIGN KEY ("receiver_wallet_id") REFERENCES "wallets"("id");