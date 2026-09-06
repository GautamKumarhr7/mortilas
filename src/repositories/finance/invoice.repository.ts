import { eq } from 'drizzle-orm';
import { db } from '../../db/index.js';
import { invoices, Invoice, NewInvoice } from '../../models/finance/invoice.model.js';

export class InvoiceRepository {
  async create(data: NewInvoice): Promise<Invoice> {
    const [result] = await db.insert(invoices).values(data).returning();
    return result;
  }

  async findAll(): Promise<Invoice[]> {
    return db.select().from(invoices);
  }

  async findById(id: number): Promise<Invoice | undefined> {
    const [result] = await db.select().from(invoices).where(eq(invoices.id, id));
    return result;
  }

  async update(id: number, data: Partial<NewInvoice>): Promise<Invoice | undefined> {
    data.updatedAt = new Date();
    const [result] = await db.update(invoices).set(data).where(eq(invoices.id, id)).returning();
    return result;
  }

  async delete(id: number): Promise<void> {
    await db.delete(invoices).where(eq(invoices.id, id));
  }
}
