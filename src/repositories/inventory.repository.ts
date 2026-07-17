import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  inventories,
  Inventory,
  NewInventory,
} from "../models/inventory.model.js";

export class InventoryRepository {
  async findAll(): Promise<Inventory[]> {
    return await db.select().from(inventories);
  }

  async findById(id: number): Promise<Inventory | undefined> {
    const result = await db
      .select()
      .from(inventories)
      .where(eq(inventories.id, id));
    return result[0];
  }

  async create(inventory: NewInventory): Promise<Inventory> {
    const result = await db.insert(inventories).values(inventory).returning();
    return result[0];
  }

  async update(
    id: number,
    inventory: Partial<NewInventory>,
  ): Promise<Inventory | undefined> {
    const result = await db
      .update(inventories)
      .set({ ...inventory, updatedAt: new Date() })
      .where(eq(inventories.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Inventory | undefined> {
    const result = await db
      .delete(inventories)
      .where(eq(inventories.id, id))
      .returning();
    return result[0];
  }
}
