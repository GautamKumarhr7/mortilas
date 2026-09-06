import { BankAccountRepository } from '../../repositories/finance/bank-account.repository.js';
import { BankAccount, NewBankAccount } from '../../models/finance/bank-account.model.js';

export class BankAccountService {
  private repository: BankAccountRepository;

  constructor() {
    this.repository = new BankAccountRepository();
  }

  async getAllBankAccounts(): Promise<BankAccount[]> {
    return this.repository.findAll();
  }

  async getBankAccountById(id: number): Promise<BankAccount | undefined> {
    return this.repository.findById(id);
  }

  async createBankAccount(data: NewBankAccount): Promise<BankAccount> {
    return this.repository.create(data);
  }

  async updateBankAccount(id: number, data: Partial<NewBankAccount>): Promise<BankAccount | undefined> {
    return this.repository.update(id, data);
  }

  async deleteBankAccount(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}
