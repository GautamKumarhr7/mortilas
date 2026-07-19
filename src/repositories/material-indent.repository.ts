import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { materialIndents, MaterialIndent, NewMaterialIndent } from '../models/operation/material-indent.model.js';
import { materialIndentItems, MaterialIndentItem, NewMaterialIndentItem } from '../models/operation/material-indent-item.model.js';

export class MaterialIndentRepository {
  async findAll(): Promise<MaterialIndent[]> {
    return await db.select().from(materialIndents);
  }

  async findById(id: number): Promise<MaterialIndent | undefined> {
    const result = await db.select().from(materialIndents).where(eq(materialIndents.id, id));
    return result[0];
  }

  async create(indent: NewMaterialIndent, items: NewMaterialIndentItem[]): Promise<MaterialIndent> {
    return await db.transaction(async (tx) => {
      const createdIndent = await tx.insert(materialIndents).values(indent).returning();
      const indentId = createdIndent[0].id;
      
      const itemsToInsert = items.map(item => ({ ...item, indentId }));
      if (itemsToInsert.length > 0) {
          await tx.insert(materialIndentItems).values(itemsToInsert);
      }
      return createdIndent[0];
    });
  }

  async update(id: number, indent: Partial<NewMaterialIndent>): Promise<MaterialIndent | undefined> {
    const result = await db
      .update(materialIndents)
      .set({ ...indent, updatedAt: new Date() })
      .where(eq(materialIndents.id, id))
      .returning();
    return result[0];
  }
}
