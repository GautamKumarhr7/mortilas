import { ChartOfAccountsRepository } from '../../repositories/finance/chart-of-accounts.repository.js';
import { NewChartOfAccount, ChartOfAccount } from '../../models/finance/chart-of-accounts.model.js';
import { db } from '../../db/index.js';
import { chartOfAccounts } from '../../models/finance/chart-of-accounts.model.js';
import { eq, like, desc } from 'drizzle-orm';

export class ChartOfAccountsService {
  private repository: ChartOfAccountsRepository;

  constructor() {
    this.repository = new ChartOfAccountsRepository();
  }

  // Derive account nature based on account type
  private getDerivedNature(accountType: string): 'DEBIT' | 'CREDIT' {
    if (accountType === 'ASSET' || accountType === 'EXPENSE') {
      return 'DEBIT';
    }
    return 'CREDIT';
  }

  async createAccount(data: Omit<NewChartOfAccount, 'accountCode' | 'level' | 'accountNature'>): Promise<ChartOfAccount> {
    return db.transaction(async (tx) => {
      let level = 1;
      let accountCode = '';

      if (data.parentId) {
        // Hierarchy Validation
        const parent = await tx.select().from(chartOfAccounts).where(eq(chartOfAccounts.id, data.parentId));
        if (parent.length === 0) throw new Error('Parent account does not exist');
        
        const p = parent[0];
        if (!p.isActive || p.deletedAt) throw new Error('Parent account is inactive or deleted');
        if (!p.isGroup) throw new Error('Parent account is not a group');
        if (p.accountType !== data.accountType) throw new Error('Child accountType must match parent accountType');
        
        level = p.level + 1;

        // Code Generation Strategy based on Parent Code
        const prefix = p.accountCode;
        // Find highest code among children
        const children = await tx.select()
          .from(chartOfAccounts)
          .where(eq(chartOfAccounts.parentId, data.parentId))
          .orderBy(desc(chartOfAccounts.accountCode))
          .limit(1);

        if (children.length > 0) {
           // Increment the last sequence part. Assuming simple increment for now.
           // E.g., if parent is 11, and child is 111, next is 112.
           const lastCode = children[0].accountCode;
           const suffixLength = lastCode.length - prefix.length;
           const suffix = parseInt(lastCode.substring(prefix.length)) || 0;
           accountCode = `${prefix}${String(suffix + 1).padStart(suffixLength, '0')}`;
        } else {
           // First child, start sequence based on level
           // E.g. parent 11 -> child 1101
           accountCode = `${prefix}01`;
        }
      } else {
         // Root level accounts must have code provided or generate base code
         throw new Error('Root level groups must be created via system seed');
      }

      const accountNature = this.getDerivedNature(data.accountType);

      const [result] = await tx.insert(chartOfAccounts).values({
        ...data,
        accountCode,
        level,
        accountNature,
      }).returning();

      return result;
    });
  }

  async getAllAccounts(): Promise<ChartOfAccount[]> {
    return this.repository.findAll();
  }

  async getAccountById(id: number): Promise<ChartOfAccount | undefined> {
    return this.repository.findById(id);
  }

  async updateAccount(id: number, data: Partial<NewChartOfAccount>): Promise<ChartOfAccount> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new Error('Account not found');
    if (existing.isSystemAccount) throw new Error('Cannot modify a system account');

    const result = await this.repository.update(id, data);
    if (!result) throw new Error('Failed to update account');
    return result;
  }

  async deactivateAccount(id: number): Promise<ChartOfAccount> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new Error('Account not found');
    if (existing.isSystemAccount) throw new Error('Cannot deactivate a system account');

    const result = await this.repository.softDelete(id);
    if (!result) throw new Error('Failed to deactivate account');
    return result;
  }
}
