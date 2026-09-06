import { InvoiceRepository } from '../../repositories/finance/invoice.repository.js';
import { Invoice, NewInvoice } from '../../models/finance/invoice.model.js';

export class InvoiceService {
  private repository: InvoiceRepository;

  constructor() {
    this.repository = new InvoiceRepository();
  }

  async createInvoice(data: NewInvoice): Promise<Invoice> {
    return await this.repository.create(data);
  }

  async getAllInvoices(): Promise<Invoice[]> {
    return await this.repository.findAll();
  }

  async getInvoiceById(id: number): Promise<Invoice | undefined> {
    return await this.repository.findById(id);
  }

  async updateInvoice(id: number, data: Partial<NewInvoice>): Promise<Invoice | undefined> {
    return await this.repository.update(id, data);
  }

  async deleteInvoice(id: number): Promise<void> {
    return await this.repository.delete(id);
  }
}
