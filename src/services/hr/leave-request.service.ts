import { LeaveRequestRepository } from '../../repositories/leave-request.repository.js';
import { LeaveRepository } from '../../repositories/leave.repository.js';
import { LeaveRequest, NewLeaveRequest } from '../../models/hr/leave-request.model.js';
import { Leave } from '../../models/hr/leave.model.js';

export class LeaveRequestService {
  private leaveRequestRepository: LeaveRequestRepository;
  private leaveRepository: LeaveRepository;

  constructor() {
    this.leaveRequestRepository = new LeaveRequestRepository();
    this.leaveRepository = new LeaveRepository();
  }

  async getAllLeaveRequests(): Promise<LeaveRequest[]> {
    return await this.leaveRequestRepository.findAll();
  }

  async getLeaveRequestsByEmployeeId(employeeId: number): Promise<LeaveRequest[]> {
    return await this.leaveRequestRepository.findByEmployeeId(employeeId);
  }

  async getLeaveRequestById(id: number): Promise<LeaveRequest | undefined> {
    return await this.leaveRequestRepository.findById(id);
  }

  async createLeaveRequest(leaveRequestData: NewLeaveRequest): Promise<LeaveRequest> {
    // 1. Fetch or create leave balance
    let leaveBalance = await this.leaveRepository.findByEmployeeId(leaveRequestData.employeeId);

    if (!leaveBalance) {
      // Create defaults
      leaveBalance = await this.leaveRepository.create({
        employeeId: leaveRequestData.employeeId,
      });
    }

    // 2. Calculate requested days
    const fromDate = new Date(leaveRequestData.fromDate);
    const toDate = new Date(leaveRequestData.toDate);
    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const requestedDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // Inclusive

    // 3. Validate and deduct balance
    const updatedBalance: Partial<Leave> = {};
    const type = leaveRequestData.type;

    switch (type) {
      case 'CL':
        if (leaveBalance.remainCl < requestedDays)
          throw new Error('Insufficient Casual Leave balance');
        updatedBalance.remainCl = leaveBalance.remainCl - requestedDays;
        break;
      case 'SL':
        if (leaveBalance.remainSl < requestedDays)
          throw new Error('Insufficient Sick Leave balance');
        updatedBalance.remainSl = leaveBalance.remainSl - requestedDays;
        break;
      case 'EL':
        if (leaveBalance.remainEl < requestedDays)
          throw new Error('Insufficient Earned Leave balance');
        updatedBalance.remainEl = leaveBalance.remainEl - requestedDays;
        break;
      case 'LWP':
        // LWP doesn't usually have a hard limit, but we track it or just subtract
        updatedBalance.remainLwp = leaveBalance.remainLwp - requestedDays;
        break;
      case 'Maternity':
        if (leaveBalance.remainMaternity < requestedDays)
          throw new Error('Insufficient Maternity Leave balance');
        updatedBalance.remainMaternity = leaveBalance.remainMaternity - requestedDays;
        break;
      case 'Paternity':
        if (leaveBalance.remainPaternity < requestedDays)
          throw new Error('Insufficient Paternity Leave balance');
        updatedBalance.remainPaternity = leaveBalance.remainPaternity - requestedDays;
        break;
      case 'CompOff':
        if (leaveBalance.remainCompOff < requestedDays)
          throw new Error('Insufficient Compensatory Off balance');
        updatedBalance.remainCompOff = leaveBalance.remainCompOff - requestedDays;
        break;
      default:
        throw new Error('Invalid leave type');
    }

    // 4. Update the balance in db
    await this.leaveRepository.update(leaveBalance.id, updatedBalance);

    // 5. Create leave request
    return await this.leaveRequestRepository.create(leaveRequestData);
  }

  async updateLeaveRequest(
    id: number,
    leaveRequestData: Partial<NewLeaveRequest>,
  ): Promise<LeaveRequest | undefined> {
    return await this.leaveRequestRepository.update(id, leaveRequestData);
  }

  async deleteLeaveRequest(id: number): Promise<LeaveRequest | undefined> {
    return await this.leaveRequestRepository.delete(id);
  }
}
