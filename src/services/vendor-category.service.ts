import { VendorCategoryRepository } from '../repositories/vendor-category.repository.js';
import { VendorCategory, NewVendorCategory } from '../models/vendor-category.model.js';

export class VendorCategoryService {
  private vendorCategoryRepository: VendorCategoryRepository;

  constructor() {
    this.vendorCategoryRepository = new VendorCategoryRepository();
  }

  async getAllVendorCategories(): Promise<VendorCategory[]> {
    return await this.vendorCategoryRepository.findAll();
  }

  async getVendorCategoryById(id: number): Promise<VendorCategory | undefined> {
    return await this.vendorCategoryRepository.findById(id);
  }

  async createVendorCategory(data: NewVendorCategory): Promise<VendorCategory> {
    return await this.vendorCategoryRepository.create(data);
  }

  async updateVendorCategory(
    id: number,
    data: Partial<NewVendorCategory>,
  ): Promise<VendorCategory | undefined> {
    return await this.vendorCategoryRepository.update(id, data);
  }

  async deleteVendorCategory(id: number): Promise<VendorCategory | undefined> {
    return await this.vendorCategoryRepository.delete(id);
  }
}
