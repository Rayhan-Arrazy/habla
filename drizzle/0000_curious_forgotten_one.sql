CREATE TABLE "quiz_attempts" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"word_id" integer NOT NULL,
	"is_correct" boolean NOT NULL,
	"attempt_date" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_words" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"word_id" integer NOT NULL,
	"next_review_date" timestamp DEFAULT now(),
	"review_interval" double precision DEFAULT 0,
	"ease_factor" double precision DEFAULT 2.5,
	"repetitions" integer DEFAULT 0,
	"is_bookmarked" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"clerk_id" text NOT NULL,
	"current_streak" integer DEFAULT 0,
	"highest_streak" integer DEFAULT 0,
	"xp" integer DEFAULT 0,
	"last_study_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_clerk_id_unique" UNIQUE("clerk_id")
);
--> statement-breakpoint
CREATE TABLE "words" (
	"id" serial PRIMARY KEY NOT NULL,
	"spanish" text NOT NULL,
	"english" text NOT NULL,
	"example_sentence_es" text,
	"example_sentence_en" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE no action ON UPDATE no action;