import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import {
  materialIndentItems,
  MaterialIndentItem,
  NewMaterialIndentItem,
} from '../models/operation/material-indent-item.model.js';

export class MaterialIndentItemRepository {
  async findAll(): Promise<MaterialIndentItem[]> {
    return await db.select().from(materialIndentItems);
  }

  async findById(id: number): Promise<MaterialIndentItem | undefined> {
    const result = await db
      .select()
      .from(materialIndentItems)
      .where(eq(materialIndentItems.id, id));
    return result[0];
  }

  async create(materialIndentItem: NewMaterialIndentItem): Promise<MaterialIndentItem> {
    const result = await db.insert(materialIndentItems).values(materialIndentItem).returning();
    return result[0];
  }

  async update(
    id: number,
    materialIndentItem: Partial<NewMaterialIndentItem>,
  ): Promise<MaterialIndentItem | undefined> {
    const result = await db
      .update(materialIndentItems)
      .set({ ...materialIndentItem, updatedAt: new Date() })
      .where(eq(materialIndentItems.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<MaterialIndentItem | undefined> {
    const result = await db
      .delete(materialIndentItems)
      .where(eq(materialIndentItems.id, id))
      .returning();
    return result[0];
  }
}
