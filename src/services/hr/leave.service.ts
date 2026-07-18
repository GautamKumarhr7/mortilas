import { LeaveRepository } from '../../repositories/leave.repository.js';
import { Leave } from '../../models/hr/leave.model.js';

export class LeaveService {
  private leaveRepository: LeaveRepository;

  constructor() {
    this.leaveRepository = new LeaveRepository();
  }

  async getLeaveBalanceByEmployeeId(employeeId: number): Promise<Leave> {
    let leaveBalance = await this.leaveRepository.findByEmployeeId(employeeId);
    if (!leaveBalance) {
      leaveBalance = await this.leaveRepository.create({
        employeeId,
      });
    }
    return leaveBalance;
  }
}
