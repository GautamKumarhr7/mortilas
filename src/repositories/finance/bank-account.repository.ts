import { eq, or, ilike } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { bankAccounts, BankAccount, NewBankAccount } from '../../models/finance/bank-account.model.js';

export class BankAccountRepository {
  async findAll(): Promise<BankAccount[]> {
    return db.select().from(bankAccounts).orderBy(bankAccounts.createdAt);
  }

  async findById(id: number): Promise<BankAccount | undefined> {
    const [result] = await db.select().from(bankAccounts).where(eq(bankAccounts.id, id));
    return result;
  }

  async create(data: NewBankAccount): Promise<BankAccount> {
    const [result] = await db.insert(bankAccounts).values(data).returning();
    return result;
  }

  async update(id: number, data: Partial<NewBankAccount>): Promise<BankAccount | undefined> {
    data.updatedAt = new Date();
    const [result] = await db.update(bankAccounts).set(data).where(eq(bankAccounts.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<void> {
    await db.delete(bankAccounts).where(eq(bankAccounts.id, id));
  }
}
