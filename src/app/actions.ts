"use server";

import { db } from "@/db";
import { users, words } from "@/db/schema";
import { eq } from "drizzle-orm";

import { cookies } from "next/headers";
import { encrypt, getSession } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function login(username: string, pass: string) {
  const user = await db.select().from(users).where(eq(users.username, username));
  if (user.length === 0) return { error: "User not found" };

  const validPassword = await bcrypt.compare(pass, user[0].password);
  if (!validPassword) return { error: "Invalid password" };

  // Create session
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const session = await encrypt({ user_id: user[0].id, username: user[0].username, role: user[0].role });
  const cookieStore = await cookies();
  cookieStore.set("session", session, { expires, httpOnly: true });

  return { success: true };
}

export async function register(username: string, pass: string, name: string, role: string) {
  const existing = await db.select().from(users).where(eq(users.username, username));
  if (existing.length > 0) return { error: "Username already taken" };

  const hashedPassword = await bcrypt.hash(pass, 10);
  await db.insert(users).values({
    username,
    password: hashedPassword,
    name,
    role
  });

  return login(username, pass);
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.set("session", "", { expires: new Date(0) });
}

export async function getUserProfile() {
  const session = await getSession();
  if (!session) return null;

  const dbUser = await db.select().from(users).where(eq(users.id, session.user_id as number));
  return dbUser[0] || null;
}

export async function getDueFlashcards() {
  const user = await getUserProfile();
  if (!user) return [];

  // Get words assigned to user
  const result = await db.execute(`
    SELECT w.*, uw.ease_factor, uw.repetitions 
    FROM words w 
    JOIN user_words uw ON w.id = uw.word_id 
    WHERE uw.user_id = ${user.id}
    ORDER BY uw.next_review_date ASC
    LIMIT 20
  `);

  return result as any[];
}

export async function getDictionaryWords() {
  const allWords = await db.select().from(words).orderBy(words.spanish);
  return allWords;
}

export async function addDictionaryWord(data: { spanish: string, english: string, exampleSentenceEs: string, exampleSentenceEn: string, synonyms?: string }) {
  const existing = await db.select().from(words).where(eq(words.spanish, data.spanish));
  if (existing.length === 0) {
    const inserted = await db.insert(words).values(data).returning();
    return inserted[0];
  }
  return existing[0];
}

export async function updateFlashcardProgress(wordId: number, ease: number) {
  const user = await getUserProfile();
  if (!user) return false;
  
  // Super simple spaced repetition mock update
  await db.execute(`
    UPDATE user_words 
    SET repetitions = repetitions + 1,
        ease_factor = ease_factor + (${ease === 3 ? 0.1 : ease === 1 ? -0.2 : 0}),
        next_review_date = NOW() + INTERVAL '1 day' * (repetitions + 1) * ${ease}
    WHERE user_id = ${user.id} AND word_id = ${wordId}
  `);
  
  return true;
}
