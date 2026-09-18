ALTER TABLE "board" ADD COLUMN "recipient_bio" text;--> statement-breakpoint
ALTER TABLE "board" ADD COLUMN "recipient_photos" jsonb DEFAULT '[]'::jsonb NOT NULL;