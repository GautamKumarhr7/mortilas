import { MaterialIndentItemRepository } from '../../repositories/material-indent-item.repository.js';
import { MaterialIndentItem, NewMaterialIndentItem } from '../../models/operation/material-indent-item.model.js';

export class MaterialIndentItemService {
  private materialIndentItemRepository: MaterialIndentItemRepository;

  constructor() {
    this.materialIndentItemRepository = new MaterialIndentItemRepository();
  }

  async getAllMaterialIndentItems(): Promise<MaterialIndentItem[]> {
    return await this.materialIndentItemRepository.findAll();
  }

  async getMaterialIndentItemById(id: number): Promise<MaterialIndentItem | undefined> {
    return await this.materialIndentItemRepository.findById(id);
  }

  async createMaterialIndentItem(data: NewMaterialIndentItem): Promise<MaterialIndentItem> {
    return await this.materialIndentItemRepository.create(data);
  }

  async updateMaterialIndentItem(
    id: number,
    data: Partial<NewMaterialIndentItem>,
  ): Promise<MaterialIndentItem | undefined> {
    return await this.materialIndentItemRepository.update(id, data);
  }

  async deleteMaterialIndentItem(id: number): Promise<MaterialIndentItem | undefined> {
    return await this.materialIndentItemRepository.delete(id);
  }
}
