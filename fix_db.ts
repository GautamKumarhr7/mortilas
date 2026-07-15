import { pool } from './src/db/index.js';

async function fix() {
  try {
    await pool.query('ALTER TABLE "role_permissions" DROP COLUMN IF EXISTS "module_id" CASCADE;');
    console.log('Dropped module_id column successfully');
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

fix();
