import { eq, like } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { db } from "../db/index.js";
import { vendors, Vendor, NewVendor } from "../models/vendor.model.js";

export class VendorRepository {
  async findAll(): Promise<Vendor[]> {
    return await db.select().from(vendors);
  }

  async findById(id: string): Promise<Vendor | undefined> {
    const result = await db.select().from(vendors).where(eq(vendors.id, id));
    return result[0];
  }

  async findByVendorCode(vendorCode: string): Promise<Vendor | undefined> {
    const result = await db
      .select()
      .from(vendors)
      .where(eq(vendors.vendorCode, vendorCode));
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

  async update(
    id: string,
    vendor: Partial<NewVendor>,
  ): Promise<Vendor | undefined> {
    const result = await db
      .update(vendors)
      .set({ ...vendor, updatedAt: new Date() })
      .where(eq(vendors.id, id))
      .returning();
    return result[0];
  }

  async delete(id: string): Promise<Vendor | undefined> {
    const result = await db
      .delete(vendors)
      .where(eq(vendors.id, id))
      .returning();
    return result[0];
  }
}
