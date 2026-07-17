import { ReimbursementRepository } from '../repositories/reimbursement.repository.js';
import { Reimbursement, NewReimbursement } from '../models/reimbursement.model.js';

export class ReimbursementService {
  private repo: ReimbursementRepository;

  constructor() {
    this.repo = new ReimbursementRepository();
  }

  async getAll(): Promise<Reimbursement[]> {
    return await this.repo.findAll();
  }

  async getById(id: number): Promise<Reimbursement | undefined> {
    return await this.repo.findById(id);
  }

  async getByEmployee(employeeId: number): Promise<Reimbursement[]> {
    return await this.repo.findByEmployee(employeeId);
  }

  async create(data: NewReimbursement): Promise<Reimbursement> {
    return await this.repo.create({ ...data, status: 'pending' });
  }

  async update(id: number, data: Partial<NewReimbursement>): Promise<Reimbursement | undefined> {
    return await this.repo.update(id, data);
  }

  async delete(id: number): Promise<Reimbursement | undefined> {
    return await this.repo.delete(id);
  }

  /** Manager approves the claim → status moves to manager_approved */
  async managerApprove(id: number, managerId: number, remarks?: string): Promise<Reimbursement | undefined> {
    const claim = await this.repo.findById(id);
    if (!claim) throw new Error('Reimbursement not found');
    if (claim.status !== 'pending') throw new Error('Claim is not in pending state');

    return await this.repo.update(id, {
      status: 'manager_approved',
      managerId,
      managerApprovedAt: new Date(),
      managerRemarks: remarks,
    });
  }

  /** Finance approves the claim → status moves to finance_approved (ready to pay) */
  async financeApprove(id: number, financeId: number, remarks?: string): Promise<Reimbursement | undefined> {
    const claim = await this.repo.findById(id);
    if (!claim) throw new Error('Reimbursement not found');
    if (claim.status !== 'manager_approved') throw new Error('Claim must be manager-approved first');

    return await this.repo.update(id, {
      status: 'finance_approved',
      financeId,
      financeApprovedAt: new Date(),
      financeRemarks: remarks,
    });
  }

  /** Mark as paid */
  async markPaid(id: number): Promise<Reimbursement | undefined> {
    const claim = await this.repo.findById(id);
    if (!claim) throw new Error('Reimbursement not found');
    if (claim.status !== 'finance_approved') throw new Error('Claim must be finance-approved before marking paid');

    return await this.repo.update(id, { status: 'paid', paidAt: new Date() });
  }

  /** Reject at any stage */
  async reject(id: number, rejectedBy: number, reason: string): Promise<Reimbursement | undefined> {
    const claim = await this.repo.findById(id);
    if (!claim) throw new Error('Reimbursement not found');

    return await this.repo.update(id, {
      status: 'rejected',
      rejectedBy,
      rejectionReason: reason,
    });
  }
}
