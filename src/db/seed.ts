import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';
import * as dotenv from 'dotenv';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

dotenv.config({ path: '.env.local' });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

async function seed() {
  console.log('Seeding database...');

  // 1. Seed Users
  console.log('Seeding users...');
  const defaultPasswordHash = bcrypt.hashSync('password123', 10);

  const newUsers = [
    {
      username: 'rayhan_admin',
      password: defaultPasswordHash,
      name: 'Rayhan',
      role: 'administrador',
      xp: 4500,
      currentStreak: 12,
      highestStreak: 15,
      lastStudyDate: new Date(),
    },
    {
      username: 'vany_learner',
      password: defaultPasswordHash,
      name: 'Vany',
      role: 'aprendiz',
      xp: 1200,
      currentStreak: 3,
      highestStreak: 7,
      lastStudyDate: new Date(),
    }
  ];

  for (const user of newUsers) {
    // Upsert logic for users
    const existing = await db.select().from(schema.users).where(eq(schema.users.username, user.username));
    if (existing.length === 0) {
      await db.insert(schema.users).values(user);
    }
  }

  // Fetch inserted users to use their IDs
  const allUsers = await db.select().from(schema.users);
  const rayhanId = allUsers.find(u => u.name === 'Rayhan')?.id;
  const vanyId = allUsers.find(u => u.name === 'Vany')?.id;

  // 2. Seed Words (Dictionary / Flashcards Base Data)
  console.log('Seeding words...');
  const wordList = [
    { spanish: 'Desarrollo', english: 'Development', exampleSentenceEs: 'El desarrollo de software es fascinante.', exampleSentenceEn: 'Software development is fascinating.' },
    { spanish: 'Sobremesa', english: 'Table talk', exampleSentenceEs: 'Tuvimos una larga sobremesa después de cenar.', exampleSentenceEn: 'We had a long table talk after dinner.' },
    { spanish: 'Estrenar', english: 'To wear/use for the first time', exampleSentenceEs: 'Voy a estrenar mis zapatos nuevos.', exampleSentenceEn: 'I am going to wear my new shoes for the first time.' },
    { spanish: 'Madrugar', english: 'To get up early', exampleSentenceEs: 'Mañana tengo que madrugar mucho.', exampleSentenceEn: 'Tomorrow I have to get up very early.' },
    { spanish: 'Empalagar', english: 'To be too sweet / cloy', exampleSentenceEs: 'Este pastel me empalaga.', exampleSentenceEn: 'This cake cloys me.' },
    { spanish: 'Sorprendente', english: 'Surprising', exampleSentenceEs: 'El final de la película fue sorprendente.', exampleSentenceEn: 'The end of the movie was surprising.' },
    { spanish: 'Adivinar', english: 'To guess', exampleSentenceEs: 'No puedo adivinar tu contraseña.', exampleSentenceEn: 'I cannot guess your password.' },
    { spanish: 'Inolvidable', english: 'Unforgettable', exampleSentenceEs: 'Fue una experiencia inolvidable.', exampleSentenceEn: 'It was an unforgettable experience.' },
    { spanish: 'Perezoso', english: 'Lazy', exampleSentenceEs: 'Mi gato es muy perezoso.', exampleSentenceEn: 'My cat is very lazy.' },
    { spanish: 'Cansado', english: 'Tired', exampleSentenceEs: 'Estoy cansado después del trabajo.', exampleSentenceEn: 'I am tired after work.' }
  ];

  let insertedWords = [];
  for (const word of wordList) {
    const existing = await db.select().from(schema.words).where(eq(schema.words.spanish, word.spanish));
    if (existing.length === 0) {
      const inserted = await db.insert(schema.words).values(word).returning();
      insertedWords.push(inserted[0]);
    } else {
      insertedWords.push(existing[0]);
    }
  }

  // 3. Seed UserWords (Flashcards progress) and Quiz Attempts
  if (rayhanId && vanyId && insertedWords.length > 0) {
    console.log('Seeding flashcard progress and quiz history...');
    
    // Assign half the words to Rayhan and half to Vany
    for (let i = 0; i < insertedWords.length; i++) {
      const word = insertedWords[i];
      const targetUserId = i % 2 === 0 ? rayhanId : vanyId;
      
      const existingUserWord = await db.select().from(schema.userWords)
        .where(eq(schema.userWords.userId, targetUserId));
        // Note: Drizzle doesn't support basic compound eq in simple where without and() easily for existing check in simple way, we just assume empty DB for now or catch errors.
      
      try {
        await db.insert(schema.userWords).values({
          userId: targetUserId,
          wordId: word.id,
          easeFactor: 2.5 + Math.random(),
          repetitions: Math.floor(Math.random() * 5),
          isBookmarked: Math.random() > 0.8,
        });

        // Add 2 mock quiz attempts per word
        await db.insert(schema.quizAttempts).values([
          { userId: targetUserId, wordId: word.id, isCorrect: Math.random() > 0.3 },
          { userId: targetUserId, wordId: word.id, isCorrect: Math.random() > 0.1 }
        ]);
      } catch (e) {
        // Ignore unique constraint or existing relation errors in a simple seed script
      }
    }
  }

  console.log('Database seeded successfully!');
  await client.end();
}

seed().catch(async (e) => {
  console.error(e);
  await client.end();
});
