import { eq, sql } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { vouchers, Voucher, NewVoucher } from '../../models/finance/voucher.model.js';

export class VoucherRepository {
  async create(data: NewVoucher): Promise<Voucher> {
    const [result] = await db.insert(vouchers).values(data).returning();
    return result;
  }

  async findAll(): Promise<Voucher[]> {
    return await db.select().from(vouchers);
  }

  async findById(id: number): Promise<Voucher | undefined> {
    const [result] = await db.select().from(vouchers).where(eq(vouchers.id, id));
    return result;
  }

  async update(id: number, data: Partial<NewVoucher>): Promise<Voucher | undefined> {
    const [result] = await db
      .update(vouchers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vouchers.id, id))
      .returning();
    return result;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await db.delete(vouchers).where(eq(vouchers.id, id)).returning();
    return !!result;
  }

  /**
   * Ledger: fetch all vouchers that reference a specific bank account,
   * with server-side pagination.
   */
  async getLedgerByBank(
    bankId: string | number,
    page: number,
    limit: number
  ): Promise<{ data: Voucher[]; total: number; page: number; limit: number; totalPages: number }> {
    // JSONB contains check: account_ids @> '[{"id":"<bankId>"}]'
    const filter = sql`${vouchers.accountIds} @> ${JSON.stringify([{ id: String(bankId) }])}::jsonb`;
    const offset = (page - 1) * limit;

    const [countRow] = await db
      .select({ count: sql<number>`cast(count(*) as int)` })
      .from(vouchers)
      .where(filter);

    const total = countRow?.count ?? 0;

    const data = await db
      .select()
      .from(vouchers)
      .where(filter)
      .orderBy(sql`${vouchers.entrydate} desc`)
      .limit(limit)
      .offset(offset);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
