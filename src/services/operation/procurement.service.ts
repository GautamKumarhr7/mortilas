import { MaterialIndentRepository } from '../../repositories/material-indent.repository.js';
import { PurchaseOrderRepository } from '../../repositories/purchase-order.repository.js';
import { db } from '../../db/index.js';
import { inventories } from '../../models/inventory.model.js';
import { eq } from 'drizzle-orm';
import { NewMaterialIndent } from '../../models/operation/material-indent.model.js';
import { NewMaterialIndentItem } from '../../models/operation/material-indent-item.model.js';

export class ProcurementService {
  private indentRepo = new MaterialIndentRepository();
  private poRepo = new PurchaseOrderRepository();

  async createIndent(indentData: Partial<NewMaterialIndent>, items: any[]) {
    // Inventory Auto-Allotment Logic
    const processedItems: NewMaterialIndentItem[] = [];

    for (const item of items) {
      // 1. Fetch available inventory
      const invRecord = await db.select().from(inventories).where(eq(inventories.id, item.itemId)).limit(1);
      const availableQty = invRecord.length > 0 ? Number(invRecord[0].quantity || 0) : 0;
      
      const requiredQty = Number(item.requiredQty || 0);
      
      // 2. Allotment
      let allottedQty = 0;
      let shortageQty = requiredQty;
      let procurementRequired = true;

      if (availableQty >= requiredQty) {
        allottedQty = requiredQty;
        shortageQty = 0;
        procurementRequired = false;
        
        // Auto deduct from inventory
        await db.update(inventories)
          .set({ quantity: String(availableQty - allottedQty) })
          .where(eq(inventories.id, item.itemId));
          
      } else if (availableQty > 0) {
        allottedQty = availableQty;
        shortageQty = requiredQty - availableQty;
        
        // Deduct whatever is available
        await db.update(inventories)
          .set({ quantity: '0' })
          .where(eq(inventories.id, item.itemId));
      }

      processedItems.push({
        indentId: 0, // Assigned in repo
        itemId: item.itemId,
        workOrderId: indentData.workOrderId as number,
        requiredQty: String(requiredQty),
        availableQty: String(allottedQty), // The allotted amount
        shortageQty: String(shortageQty),
        procurementRequired,
        status: procurementRequired ? 'Pending' : 'Approved'
      } as NewMaterialIndentItem);
    }

    // Generate Indent No if missing
    if (!indentData.indentNo) {
        indentData.indentNo = `IND-${Date.now()}`;
    }

    return await this.indentRepo.createWithItems(indentData as NewMaterialIndent, processedItems);
  }
}
