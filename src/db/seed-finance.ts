import { db } from './index.js';
import { chartOfAccounts } from '../models/finance/chart-of-accounts.model.js';

const seedData = [
  { accountCode: '1', accountName: 'Assets', accountType: 'ASSET' as const, accountNature: 'DEBIT' as const, isGroup: true, isSystemAccount: true, level: 1 },
  { accountCode: '2', accountName: 'Liabilities', accountType: 'LIABILITY' as const, accountNature: 'CREDIT' as const, isGroup: true, isSystemAccount: true, level: 1 },
  { accountCode: '3', accountName: 'Equity', accountType: 'EQUITY' as const, accountNature: 'CREDIT' as const, isGroup: true, isSystemAccount: true, level: 1 },
  { accountCode: '4', accountName: 'Revenue', accountType: 'REVENUE' as const, accountNature: 'CREDIT' as const, isGroup: true, isSystemAccount: true, level: 1 },
  { accountCode: '5', accountName: 'Expense', accountType: 'EXPENSE' as const, accountNature: 'DEBIT' as const, isGroup: true, isSystemAccount: true, level: 1 },
];

export async function seedChartOfAccounts() {
  console.log('Seeding Chart of Accounts Root Groups...');
  
  for (const group of seedData) {
    const existing = await db.query.chartOfAccounts.findFirst({
      where: (coa, { eq }) => eq(coa.accountCode, group.accountCode)
    });
    
    if (!existing) {
      await db.insert(chartOfAccounts).values(group);
      console.log(`Inserted group: ${group.accountName}`);
    } else {
      console.log(`Group already exists: ${group.accountName}`);
    }
  }
  
  console.log('Seeding complete.');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  seedChartOfAccounts().then(() => process.exit(0)).catch(console.error);
}
