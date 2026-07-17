import { VendorRepository } from '../repositories/vendor.repository.js';
import { Vendor, NewVendor } from '../models/vendor.model.js';
import {
  generateSequentialCode,
  normalizeSequentialCode,
} from '../helpers/sequential-code.helper.js';

const VENDOR_CODE_PATTERN = /^VEN\d{4}$/;

export class VendorService {
  private vendorRepository: VendorRepository;

  constructor() {
    this.vendorRepository = new VendorRepository();
  }

  async getAllVendors(): Promise<Vendor[]> {
    return await this.vendorRepository.findAll();
  }

  async getVendorById(id: string): Promise<Vendor | undefined> {
    return await this.vendorRepository.findById(id);
  }

  async createVendor(vendorData: Partial<NewVendor>): Promise<Vendor> {
    const vendorCode = vendorData.vendorCode
      ? normalizeSequentialCode(vendorData.vendorCode, VENDOR_CODE_PATTERN, 'VEN0001')
      : generateSequentialCode(
          'VEN',
          await this.vendorRepository.findVendorCodesByPrefix('VEN'),
          4,
        );

    const existingVendor = await this.vendorRepository.findByVendorCode(vendorCode);
    if (existingVendor) {
      throw new Error('Vendor with this code already exists');
    }

    return await this.vendorRepository.create({
      ...vendorData,
      vendorCode,
      status: vendorData.status ?? 'Active',
    } as NewVendor);
  }

  async updateVendor(id: string, vendorData: Partial<NewVendor>): Promise<Vendor | undefined> {
    if (vendorData.vendorCode) {
      const vendorCode = normalizeSequentialCode(
        vendorData.vendorCode,
        VENDOR_CODE_PATTERN,
        'VEN0001',
      );
      const existingVendor = await this.vendorRepository.findByVendorCode(vendorCode);
      if (existingVendor && existingVendor.id !== id) {
        throw new Error('Vendor with this code already exists');
      }

      return await this.vendorRepository.update(id, {
        ...vendorData,
        vendorCode,
      });
    }

    return await this.vendorRepository.update(id, vendorData);
  }

  async deleteVendor(id: string): Promise<Vendor | undefined> {
    return await this.vendorRepository.delete(id);
  }
}
