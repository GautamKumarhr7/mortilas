import { VendorRateContractRepository } from '../repositories/vendor-rate-contract.repository.js';
import { VendorRateContract, NewVendorRateContract } from '../models/vendor-rate-contract.model.js';

export class VendorRateContractService {
  private vendorRateContractRepository: VendorRateContractRepository;

  constructor() {
    this.vendorRateContractRepository = new VendorRateContractRepository();
  }

  async getAllVendorRateContracts(): Promise<VendorRateContract[]> {
    return await this.vendorRateContractRepository.findAll();
  }

  async getVendorRateContractById(id: number): Promise<VendorRateContract | undefined> {
    return await this.vendorRateContractRepository.findById(id);
  }

  async createVendorRateContract(data: NewVendorRateContract): Promise<VendorRateContract> {
    return await this.vendorRateContractRepository.create(data);
  }

  async updateVendorRateContract(
    id: number,
    data: Partial<NewVendorRateContract>,
  ): Promise<VendorRateContract | undefined> {
    return await this.vendorRateContractRepository.update(id, data);
  }

  async deleteVendorRateContract(id: number): Promise<VendorRateContract | undefined> {
    return await this.vendorRateContractRepository.delete(id);
  }
}
