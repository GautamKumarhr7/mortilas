import { SubcontractorRateContractRepository } from "../repositories/subcontractor-rate-contract.repository.js";
import {
  SubcontractorRateContract,
  NewSubcontractorRateContract,
} from "../models/subcontractor-rate-contract.model.js";

export class SubcontractorRateContractService {
  private subcontractorRateContractRepository: SubcontractorRateContractRepository;

  constructor() {
    this.subcontractorRateContractRepository =
      new SubcontractorRateContractRepository();
  }

  async getAllSubcontractorRateContracts(): Promise<
    SubcontractorRateContract[]
  > {
    return await this.subcontractorRateContractRepository.findAll();
  }

  async getSubcontractorRateContractById(
    id: number,
  ): Promise<SubcontractorRateContract | undefined> {
    return await this.subcontractorRateContractRepository.findById(id);
  }

  async createSubcontractorRateContract(
    data: NewSubcontractorRateContract,
  ): Promise<SubcontractorRateContract> {
    return await this.subcontractorRateContractRepository.create(data);
  }

  async updateSubcontractorRateContract(
    id: number,
    data: Partial<NewSubcontractorRateContract>,
  ): Promise<SubcontractorRateContract | undefined> {
    return await this.subcontractorRateContractRepository.update(id, data);
  }

  async deleteSubcontractorRateContract(
    id: number,
  ): Promise<SubcontractorRateContract | undefined> {
    return await this.subcontractorRateContractRepository.delete(id);
  }
}
