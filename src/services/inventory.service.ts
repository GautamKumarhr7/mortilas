import { InventoryRepository } from "../repositories/inventory.repository.js";
import { Inventory, NewInventory } from "../models/inventory.model.js";

export class InventoryService {
  private inventoryRepository: InventoryRepository;

  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  async getAllInventories(): Promise<Inventory[]> {
    return await this.inventoryRepository.findAll();
  }

  async getInventoryById(id: number): Promise<Inventory | undefined> {
    return await this.inventoryRepository.findById(id);
  }

  async createInventory(data: NewInventory): Promise<Inventory> {
    return await this.inventoryRepository.create(data);
  }

  async updateInventory(
    id: number,
    data: Partial<NewInventory>,
  ): Promise<Inventory | undefined> {
    return await this.inventoryRepository.update(id, data);
  }

  async deleteInventory(id: number): Promise<Inventory | undefined> {
    return await this.inventoryRepository.delete(id);
  }
}
