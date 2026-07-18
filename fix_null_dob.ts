import { db } from './src/db/index.js';
import { sql } from 'drizzle-orm';

async function main() {
  await db.execute(sql`UPDATE users SET dob = '1990-01-01' WHERE dob IS NULL`);
  console.log('Fixed null dob');
  process.exit(0);
}
main();
