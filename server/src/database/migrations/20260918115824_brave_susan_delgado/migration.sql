CREATE TABLE "idempotency_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"key" varchar(100) NOT NULL UNIQUE,
	"resource" varchar(50) NOT NULL,
	"response" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"expired_at" timestamp with time zone NOT NULL
);
