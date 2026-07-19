import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { materialIndents, MaterialIndent, NewMaterialIndent, materialIndentItems, NewMaterialIndentItem } from '../models/index.js';

export class MaterialIndentRepository {
  async findAll(): Promise<MaterialIndent[]> {
    return await db.select().from(materialIndents);
  }

  async findById(id: number): Promise<MaterialIndent | undefined> {
    const result = await db.select().from(materialIndents).where(eq(materialIndents.id, id));
    return result[0];
  }

  async createWithItems(data: NewMaterialIndent, items: Omit<NewMaterialIndentItem, 'indentId'>[]): Promise<MaterialIndent> {
    return await db.transaction(async (tx) => {
      const indentResult = await tx.insert(materialIndents).values(data).returning();
      const indent = indentResult[0];

      if (items && items.length > 0) {
        const itemsToInsert = items.map(item => ({
          ...item,
          indentId: indent.id
        }));
        await tx.insert(materialIndentItems).values(itemsToInsert as any);
      }
      return indent;
    });
  }
}
