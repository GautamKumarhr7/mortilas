import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  vendorRateContracts,
  VendorRateContract,
  NewVendorRateContract,
} from "../models/vendor-rate-contract.model.js";

export class VendorRateContractRepository {
  async findAll(): Promise<VendorRateContract[]> {
    return await db.select().from(vendorRateContracts);
  }

  async findById(id: number): Promise<VendorRateContract | undefined> {
    const result = await db
      .select()
      .from(vendorRateContracts)
      .where(eq(vendorRateContracts.id, id));
    return result[0];
  }

  async create(data: NewVendorRateContract): Promise<VendorRateContract> {
    const result = await db
      .insert(vendorRateContracts)
      .values(data)
      .returning();
    return result[0];
  }

  async update(
    id: number,
    data: Partial<NewVendorRateContract>,
  ): Promise<VendorRateContract | undefined> {
    const result = await db
      .update(vendorRateContracts)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(vendorRateContracts.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<VendorRateContract | undefined> {
    const result = await db
      .delete(vendorRateContracts)
      .where(eq(vendorRateContracts.id, id))
      .returning();
    return result[0];
  }
}
