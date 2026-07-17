import { ApplicantRepository } from '../../repositories/applicant.repository.js';
import { EmployeeRepository } from '../../repositories/employee.repository.js';
import { Applicant, NewApplicant } from '../../models/hr/applicant.model.js';
import bcrypt from 'bcrypt';

export class ApplicantService {
  private repo: ApplicantRepository;
  private employeeRepo: EmployeeRepository;

  constructor() {
    this.repo = new ApplicantRepository();
    this.employeeRepo = new EmployeeRepository();
  }

  async getAll(): Promise<Applicant[]> {
    return await this.repo.findAll();
  }

  async getById(id: number): Promise<Applicant | undefined> {
    return await this.repo.findById(id);
  }

  async getByJobPost(jobPostId: number): Promise<Applicant[]> {
    return await this.repo.findByJobPost(jobPostId);
  }

  /** Applicant submits their application */
  async apply(data: NewApplicant): Promise<Applicant> {
    return await this.repo.create({ ...data, status: 'applied' });
  }

  async update(id: number, data: Partial<NewApplicant>): Promise<Applicant | undefined> {
    return await this.repo.update(id, data);
  }

  async delete(id: number): Promise<Applicant | undefined> {
    return await this.repo.delete(id);
  }

  /** Shortlist an applicant */
  async shortlist(id: number, shortlistedBy: number): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    if (applicant.status !== 'applied')
      throw new Error('Only applied candidates can be shortlisted');

    return await this.repo.update(id, {
      status: 'shortlisted',
      shortlistedBy,
      shortlistedAt: new Date(),
    });
  }

  /** Schedule an interview */
  async scheduleInterview(
    id: number,
    interviewDate: Date,
    interviewedBy: number,
    remarks?: string,
  ): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    if (applicant.status !== 'shortlisted')
      throw new Error('Only shortlisted candidates can be interviewed');

    return await this.repo.update(id, {
      status: 'interview_scheduled',
      interviewDate,
      interviewedBy,
      interviewRemarks: remarks,
    });
  }

  /** Select a candidate after interview */
  async select(id: number, selectedBy: number): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    if (applicant.status !== 'interview_scheduled')
      throw new Error('Only interviewed candidates can be selected');

    return await this.repo.update(id, {
      status: 'selected',
      selectedBy,
      selectedAt: new Date(),
    });
  }

  /** Reject a candidate */
  async reject(id: number, rejectedBy: number, reason: string): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');

    return await this.repo.update(id, {
      status: 'rejected',
      rejectedBy,
      rejectedAt: new Date(),
      rejectionReason: reason,
    });
  }

  /**
   * Onboard a selected candidate as an employee.
   * Creates a new user record with:
   *  - type: 'employee'
   *  - basicPay and joiningDate from onboarding input
   *  - Default password = DOB formatted as YYYYMMDD
   */
  async onboard(
    id: number,
    onboardingData: {
      dob: string; // YYYY-MM-DD
      joiningDate: string; // YYYY-MM-DD
      basicPay: number;
      documentPath?: string;
      employeeCode: string;
      designationId: number;
    },
  ): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    if (applicant.status !== 'selected')
      throw new Error('Only selected candidates can be onboarded');

    // Generate default password from DOB: YYYYMMDD
    const defaultPassword = onboardingData.dob.replace(/-/g, '');
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    // Create user/employee record
    const newEmployee = await this.employeeRepo.create({
      name: applicant.name,
      email: applicant.email,
      password: hashedPassword,
      type: 'employee',
      dob: onboardingData.dob,
      dateOfJoining: onboardingData.joiningDate,
      basicPay: String(onboardingData.basicPay),
      employeeCode: onboardingData.employeeCode,
      designationId: onboardingData.designationId,
    });

    // Update applicant record with onboarding info
    return await this.repo.update(id, {
      status: 'onboarded',
      onboardedUserId: newEmployee.id,
      joiningDate: onboardingData.joiningDate,
      basicPay: String(onboardingData.basicPay),
      documentPath: onboardingData.documentPath,
    });
  }
}
