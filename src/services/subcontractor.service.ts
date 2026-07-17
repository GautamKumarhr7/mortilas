import { SubcontractorRepository } from "../repositories/subcontractor.repository.js";
import {
  Subcontractor,
  NewSubcontractor,
} from "../models/subcontractor.model.js";
import {
  generateSequentialCode,
  normalizeSequentialCode,
} from "../helpers/sequential-code.helper.js";

const SUBCONTRACTOR_CODE_PATTERN = /^SUB\d{4}$/;

export class SubcontractorService {
  private subcontractorRepository: SubcontractorRepository;

  constructor() {
    this.subcontractorRepository = new SubcontractorRepository();
  }

  async getAllSubcontractors(): Promise<Subcontractor[]> {
    return await this.subcontractorRepository.findAll();
  }

  async getSubcontractorById(id: string): Promise<Subcontractor | undefined> {
    return await this.subcontractorRepository.findById(id);
  }

  async createSubcontractor(
    subcontractorData: Partial<NewSubcontractor>,
  ): Promise<Subcontractor> {
    const subcontractorCode = subcontractorData.subcontractorCode
      ? normalizeSequentialCode(
          subcontractorData.subcontractorCode,
          SUBCONTRACTOR_CODE_PATTERN,
          "SUB0001",
        )
      : generateSequentialCode(
          "SUB",
          await this.subcontractorRepository.findSubcontractorCodesByPrefix(
            "SUB",
          ),
          4,
        );

    const existingSubcontractor =
      await this.subcontractorRepository.findBySubcontractorCode(
        subcontractorCode,
      );
    if (existingSubcontractor) {
      throw new Error("Subcontractor with this code already exists");
    }

    return await this.subcontractorRepository.create({
      ...subcontractorData,
      subcontractorCode,
      status: subcontractorData.status ?? "Active",
    } as NewSubcontractor);
  }

  async updateSubcontractor(
    id: string,
    subcontractorData: Partial<NewSubcontractor>,
  ): Promise<Subcontractor | undefined> {
    if (subcontractorData.subcontractorCode) {
      const subcontractorCode = normalizeSequentialCode(
        subcontractorData.subcontractorCode,
        SUBCONTRACTOR_CODE_PATTERN,
        "SUB0001",
      );
      const existingSubcontractor =
        await this.subcontractorRepository.findBySubcontractorCode(
          subcontractorCode,
        );
      if (existingSubcontractor && existingSubcontractor.id !== id) {
        throw new Error("Subcontractor with this code already exists");
      }

      return await this.subcontractorRepository.update(id, {
        ...subcontractorData,
        subcontractorCode,
      });
    }

    return await this.subcontractorRepository.update(id, subcontractorData);
  }

  async deleteSubcontractor(id: string): Promise<Subcontractor | undefined> {
    return await this.subcontractorRepository.delete(id);
  }
}
