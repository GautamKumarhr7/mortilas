import pkg from 'pg';
import dotenv from 'dotenv';
import { createHash } from 'crypto';
import { readFile, readdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Pool } = pkg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_FOLDER = path.resolve(__dirname, '../../drizzle');

// Journal timestamps — from drizzle/meta/_journal.json
const journalTimestamps: Record<string, number> = {
  '0000_fast_punisher':                1783852372245,
  '0001_nasty_dracula':                1783855149983,
  '0002_strange_thaddeus_ross':        1783976824671,
  '0003_gigantic_moira_mactaggert':   1784123232694,
  '0004_client_crud':                  1784250000000,
  '0005_project_crud':                 1784250000001,
  '0006_work_order_crud':              1784250000002,
  '0007_material_indent_items':        1784250000003,
  '0008_inventory_crud':               1784250000004,
  '0009_vendor_and_subcontractor_crud':1784250000005,
  '0010_thin_eternals':                1784282221681,
  '0011_parallel_triton':              1784315682830,
  '0012_rainy_leper_queen':            1784360696582,
  '0013_fearless_shiver_man':          1784372163351,
  '0014_violet_lethal_legion':         1784462709440,
  '0015_wakeful_quasimodo':            1784462815169,
  '0016_melodic_stature':              1785056166210,
  '0017_vendor_password':              1785056166211,
  '0018_grn_enhancements':             1785056166212,
  '0019_grn_payment_initiation':       1785056166213,
  '0020_bid_material_average_prices':  1785056166214,
  '0021_grn_item_average_price':       1785056166215,
  '0022_smiling_selene':               1785783150451,
  '0023_yummy_carmella_unuscione':     1787348554831,
  '0024_sour_thaddeus_ross':           1787349247004,
  '0025_nebulous_domino':              1787480740126,
};

async function main() {
  const client = await pool.connect();
  console.log('Repairing drizzle.__drizzle_migrations...\n');

  // Ensure drizzle schema exists
  await client.query(`CREATE SCHEMA IF NOT EXISTS drizzle;`);
  await client.query(`
    CREATE TABLE IF NOT EXISTS drizzle.__drizzle_migrations (
      id SERIAL PRIMARY KEY,
      hash TEXT NOT NULL,
      created_at BIGINT
    );
  `);

  // Get already-applied timestamps
  const { rows: existing } = await client.query(
    `SELECT created_at FROM drizzle.__drizzle_migrations`
  );
  const appliedTimestamps = new Set(existing.map((r: any) => Number(r.created_at)));

  // Read all SQL files and insert missing ones
  const files = (await readdir(MIGRATIONS_FOLDER))
    .filter(f => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    const tag = file.replace('.sql', '');
    if (tag === '0026_dusty_robbie_robertson') {
      console.log(`⏭  Skipping (will apply fresh): ${file}`);
      continue;
    }

    const when = journalTimestamps[tag];
    if (!when) {
      console.log(`⚠  No journal entry for ${file}, skipping`);
      continue;
    }

    if (appliedTimestamps.has(when)) {
      console.log(`✓  Already applied: ${file}`);
      continue;
    }

    const content = await readFile(path.join(MIGRATIONS_FOLDER, file), 'utf-8');
    const hash = createHash('sha256').update(content).digest('hex');

    await client.query(
      `INSERT INTO drizzle.__drizzle_migrations (hash, created_at) VALUES ($1, $2)`,
      [hash, when]
    );
    console.log(`  ✅ Inserted missing: ${file}`);
  }

  console.log('\n✅ Done! Now run: npm run migrate');
  client.release();
  await pool.end();
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});

