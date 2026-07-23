import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client);

async function run() {
  try {
    await db.execute(`DROP TABLE IF EXISTS user_words CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS quiz_attempts CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS users CASCADE`);
    console.log('Tables dropped successfully');
  } catch (e) {
    console.error(e);
  } finally {
    await client.end();
  }
}

run();
