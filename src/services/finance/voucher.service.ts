import { VoucherRepository } from '../../repositories/finance/voucher.repository.js';
import { NewVoucher } from '../../models/finance/voucher.model.js';

export class VoucherService {
  private repository: VoucherRepository;

  constructor() {
    this.repository = new VoucherRepository();
  }

  async createVoucher(data: any) {
    const parsed: NewVoucher = {
      ...data,
      entrydate: data.entrydate ? new Date(data.entrydate) : new Date(),
    };
    return await this.repository.create(parsed);
  }

  async getAllVouchers() {
    return await this.repository.findAll();
  }

  async getVoucherById(id: number) {
    return await this.repository.findById(id);
  }

  async updateVoucher(id: number, data: Partial<NewVoucher>) {
    return await this.repository.update(id, data);
  }

  async deleteVoucher(id: number) {
    return await this.repository.delete(id);
  }

  async getLedgerByBank(bankId: string | number, page = 1, limit = 10) {
    return await this.repository.getLedgerByBank(bankId, page, limit);
  }
}
