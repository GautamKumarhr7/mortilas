import { eq, like } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import { db } from '../db/index.js';
import { vendors, Vendor, NewVendor } from '../models/vendor.model.js';
import { vendorCategories } from '../models/vendor-category.model.js';
import { vendorRateContracts, VendorRateContract, NewVendorRateContract } from '../models/vendor-rate-contract.model.js';

export class VendorRepository {
  async findAll(): Promise<any[]> {
    return await db
      .select({
        vendor: vendors,
        category: vendorCategories,
      })
      .from(vendors)
      .leftJoin(vendorCategories, eq(vendors.categoryId, vendorCategories.id));
  }

  async findById(id: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id));
    return result[0];
  }

  async findByVendorCode(vendorCode: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.vendorCode, vendorCode));
    return result[0];
  }

  async findVendorCodesByPrefix(prefix: string): Promise<string[]> {
    const result = await db
      .select({ vendorCode: vendors.vendorCode })
      .from(vendors)
      .where(like(vendors.vendorCode, `${prefix}%`));
    return result.map((row) => row.vendorCode);
  }

  async create(vendor: NewVendor): Promise<Vendor> {
    const result = await db
      .insert(vendors)
      .values({ ...vendor, id: vendor.id ?? randomUUID() })
      .returning();
    return result[0];
  }

  async update(id: string, vendor: Partial<NewVendor>): Promise<Vendor | undefined> {
    const result = await db
      .update(vendors)
      .set({ ...vendor, updatedAt: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<Vendor | undefined> {
    const result = await db.delete(vendors).where(eq(vendors.id, id)).returning();
    return result[0];
  }

  // Rate Contracts
  async findRateContractsByVendor(vendorId: string): Promise<VendorRateContract[]> {
    return await db.select().from(vendorRateContracts).where(eq(vendorRateContracts.vendorId, vendorId));
  }

  async createRateContract(rateContract: NewVendorRateContract): Promise<VendorRateContract> {
    const result = await db
      .insert(vendorRateContracts)
      .values(rateContract)
      .returning();
    return result[0];
  }

  async updateRateContract(id: number, rateContract: Partial<NewVendorRateContract>): Promise<VendorRateContract | undefined> {
    const result = await db
      .update(vendorRateContracts)
      .set({ ...rateContract, updatedAt: new Date() })
      .where(eq(vendorRateContracts.id, id))
      .returning();
    return result[0];
  }
}
