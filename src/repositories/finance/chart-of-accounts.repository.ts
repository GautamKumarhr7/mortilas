import { eq, isNull, and } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { chartOfAccounts, NewChartOfAccount, ChartOfAccount } from '../../models/finance/chart-of-accounts.model.js';

export class ChartOfAccountsRepository {
  async create(data: NewChartOfAccount): Promise<ChartOfAccount> {
    const [result] = await db.insert(chartOfAccounts).values(data).returning();
    return result;
  }

  async findById(id: number): Promise<ChartOfAccount | undefined> {
    const [result] = await db
      .select()
      .from(chartOfAccounts)
      .where(and(eq(chartOfAccounts.id, id), isNull(chartOfAccounts.deletedAt)));
    return result;
  }

  async findAll(): Promise<ChartOfAccount[]> {
    return db
      .select()
      .from(chartOfAccounts)
      .where(isNull(chartOfAccounts.deletedAt));
  }

  async update(id: number, data: Partial<NewChartOfAccount>): Promise<ChartOfAccount | undefined> {
    data.updatedAt = new Date();
    const [result] = await db
      .update(chartOfAccounts)
      .set(data)
      .where(and(eq(chartOfAccounts.id, id), isNull(chartOfAccounts.deletedAt)))
      .returning();
    return result;
  }

  async softDelete(id: number): Promise<ChartOfAccount | undefined> {
    const [result] = await db
      .update(chartOfAccounts)
      .set({ deletedAt: new Date(), isActive: false })
      .where(eq(chartOfAccounts.id, id))
      .returning();
    return result;
  }
}
