import { pgTable, serial, text, integer, timestamp, boolean, doublePrecision } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  currentStreak: integer("current_streak").default(0),
  highestStreak: integer("highest_streak").default(0),
  xp: integer("xp").default(0),
  lastStudyDate: timestamp("last_study_date"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  spanish: text("spanish").notNull(),
  english: text("english").notNull(),
  exampleSentenceEs: text("example_sentence_es"),
  exampleSentenceEn: text("example_sentence_en"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const userWords = pgTable("user_words", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  wordId: integer("word_id").references(() => words.id).notNull(),
  nextReviewDate: timestamp("next_review_date").defaultNow(),
  reviewInterval: doublePrecision("review_interval").default(0),
  easeFactor: doublePrecision("ease_factor").default(2.5),
  repetitions: integer("repetitions").default(0),
  isBookmarked: boolean("is_bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const quizAttempts = pgTable("quiz_attempts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  wordId: integer("word_id").references(() => words.id).notNull(),
  isCorrect: boolean("is_correct").notNull(),
  attemptDate: timestamp("attempt_date").defaultNow(),
});
