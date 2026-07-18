import { ApplicantRepository } from '../../repositories/applicant.repository.js';
import { EmployeeRepository } from '../../repositories/employee.repository.js';
import { JobPostRepository } from '../../repositories/job-post.repository.js';
import { Applicant, NewApplicant } from '../../models/hr/applicant.model.js';
import bcrypt from 'bcrypt';

export class ApplicantService {
  private repo: ApplicantRepository;
  private employeeRepo: EmployeeRepository;
  private jobPostRepo: JobPostRepository;

  constructor() {
    this.repo = new ApplicantRepository();
    this.employeeRepo = new EmployeeRepository();
    this.jobPostRepo = new JobPostRepository();
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
    // Relaxed check: can select from applied, shortlisted, or interview_scheduled
    if (applicant.status === 'selected' || applicant.status === 'rejected' || applicant.status === 'onboarded') {
      throw new Error('Candidate is already selected, rejected, or onboarded');
    }

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
      joiningDate: string; // YYYY-MM-DD
      basicPay: number;
      documentPath?: string;
    },
  ): Promise<Applicant | undefined> {
    const applicant = await this.repo.findById(id);
    if (!applicant) throw new Error('Applicant not found');
    if (applicant.status !== 'selected')
      throw new Error('Only selected candidates can be onboarded');
    
    if (!applicant.userId) {
      throw new Error('Cannot onboard: Applicant is not linked to a registered user account');
    }

    // Fetch Job Post for Auto-Detection
    const jobPost = await this.jobPostRepo.findById(applicant.jobPostId);
    if (!jobPost) throw new Error('Job Post not found');

    const finalBasicPay = onboardingData.basicPay || jobPost.basicPay || 0;

    // Update existing user/employee record
    const updatedEmployee = await this.employeeRepo.update(applicant.userId, {
      type: 'employee',
      dateOfJoining: onboardingData.joiningDate,
      basicPay: String(finalBasicPay),
      employeeCode: `EMP-${applicant.userId.toString().padStart(4, '0')}`,
      designationId: jobPost.designationId || 0,
      departmentId: jobPost.departmentId,
      employmentType: jobPost.employmentType,
    });

    if (!updatedEmployee) {
      throw new Error('Failed to update employee record during onboarding');
    }

    // Update applicant record with onboarding info
    return await this.repo.update(id, {
      status: 'onboarded',
      onboardedUserId: updatedEmployee.id,
      joiningDate: onboardingData.joiningDate,
      basicPay: String(finalBasicPay),
      documentPath: onboardingData.documentPath,
    });
  }
}
