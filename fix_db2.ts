import { pool } from './src/db/index.js';

async function fix() {
  try {
    await pool.query('TRUNCATE TABLE "role_permissions" CASCADE;');
    console.log('Truncated role_permissions successfully');
  } catch(e) {
    console.error(e);
  } finally {
    await pool.end();
  }
}

fix();
