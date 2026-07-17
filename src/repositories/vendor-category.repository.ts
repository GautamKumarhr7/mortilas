import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  vendorCategories,
  VendorCategory,
  NewVendorCategory,
} from "../models/vendor-category.model.js";

export class VendorCategoryRepository {
  async findAll(): Promise<VendorCategory[]> {
    return await db.select().from(vendorCategories);
  }

  async findById(id: number): Promise<VendorCategory | undefined> {
    const result = await db
      .select()
      .from(vendorCategories)
      .where(eq(vendorCategories.id, id));
    return result[0];
  }

  async create(data: NewVendorCategory): Promise<VendorCategory> {
    const result = await db.insert(vendorCategories).values(data).returning();
    return result[0];
  }

  async update(
    id: number,
    data: Partial<NewVendorCategory>,
  ): Promise<VendorCategory | undefined> {
    const result = await db
      .update(vendorCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vendorCategories.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<VendorCategory | undefined> {
    const result = await db
      .delete(vendorCategories)
      .where(eq(vendorCategories.id, id))
      .returning();
    return result[0];
  }
}
