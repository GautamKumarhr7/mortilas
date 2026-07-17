import { PayrollRepository } from '../../repositories/payroll.repository.js';
import { EmployeeRepository } from '../../repositories/employee.repository.js';
import { Payroll, NewPayroll } from '../../models/hr/payroll.model.js';

interface GeneratePayrollInput {
  employeeId: number;
  payMonth: number;
  payYear: number;
  payDate?: string;
  advanceLoanRecovery?: number; // manual entry per payroll run
  professionalTax?: number; // applicable per state/policy
  remarks?: string;
}

export class PayrollService {
  private payrollRepository: PayrollRepository;
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.payrollRepository = new PayrollRepository();
    this.employeeRepository = new EmployeeRepository();
  }

  /**
   * Generates a payroll record by computing all values from the employee's basicPay.
   *
   * Salary Structure:
   *  Earnings:
   *    - Basic Salary             = employee.basicPay
   *    - HRA                      = 20% of Basic
   *    - Conveyance Allowance     = 15% of Basic
   *    - Special Allowance        = 60% of Basic
   *    - Gross Salary             = Basic + HRA + Conveyance + Special
   *
   *  Employee Deductions (stored on payslip):
   *    - Employee PF              = 12% of Basic  (if pfApplicable)
   *    - Employee ESI             = 0.75% of Gross (if esiApplicable)
   *    - Professional Tax         = as provided (deducted in September)
   *    - TDS                      = as per tdsApplicable
   *    - Advance/Loan Recovery    = manual entry
   *    - Total Deductions         = sum of above
   *    - Net Salary               = Gross - Total Deductions
   *
   *  Employer Contributions (cost centre, NOT on payslip):
   *    - Employer PF              = 12% of Basic  (if pfApplicable)
   *    - Employer ESI             = 3.25% of Gross (if esiApplicable)
   *    - Total Employer Cost      = Gross + Employer PF + Employer ESI
   */
  async generatePayroll(input: GeneratePayrollInput): Promise<Payroll> {
    const employee = await this.employeeRepository.findById(input.employeeId);
    if (!employee) throw new Error('Employee not found');
    if (!employee.basicPay) throw new Error('Employee does not have a basic pay set');

    const basic = parseFloat(String(employee.basicPay));

    // ── Earnings ──────────────────────────────────────────────────────
    const hra = parseFloat((basic * 0.2).toFixed(2)); // 20% of basic
    const conveyance = parseFloat((basic * 0.15).toFixed(2)); // 15% of basic
    const specialAllowance = parseFloat((basic * 0.6).toFixed(2)); // 60% of basic
    const gross = parseFloat((basic + hra + conveyance + specialAllowance).toFixed(2));

    // ── Employee Deductions ───────────────────────────────────────────
    const empPf = employee.pfApplicable
      ? parseFloat((basic * 0.12).toFixed(2)) // 12% of basic
      : 0;

    const empEsi = employee.esiApplicable
      ? parseFloat((gross * 0.0075).toFixed(2)) // 0.75% of gross
      : 0;

    // Professional Tax: only in September (month === 9) unless overridden
    const profTax =
      input.professionalTax !== undefined ? input.professionalTax : input.payMonth === 9 ? 200 : 0; // default ₹200 in September; adjust per state

    const tds = employee.tdsApplicable ?? 0;
    const advance = input.advanceLoanRecovery ?? 0;

    const totalDeductions = parseFloat((empPf + empEsi + profTax + tds + advance).toFixed(2));
    const netSalary = parseFloat((gross - totalDeductions).toFixed(2));

    // ── Employer Contributions (cost centre) ──────────────────────────
    const employerPf = employee.pfApplicable
      ? parseFloat((basic * 0.12).toFixed(2)) // 12% of basic
      : 0;

    const employerEsi = employee.esiApplicable
      ? parseFloat((gross * 0.0325).toFixed(2)) // 3.25% of gross
      : 0;

    const totalEmployerCost = parseFloat((gross + employerPf + employerEsi).toFixed(2));

    const payrollData: NewPayroll = {
      employeeId: input.employeeId,
      payMonth: input.payMonth,
      payYear: input.payYear,
      payDate: input.payDate,
      basicSalary: String(basic),
      hra: String(hra),
      conveyanceAllowance: String(conveyance),
      specialAllowance: String(specialAllowance),
      grossSalary: String(gross),
      employeePf: String(empPf),
      employeeEsi: String(empEsi),
      professionalTax: String(profTax),
      tds: String(tds),
      advanceLoanRecovery: String(advance),
      totalDeductions: String(totalDeductions),
      netSalary: String(netSalary),
      employerPf: String(employerPf),
      employerEsi: String(employerEsi),
      totalEmployerCost: String(totalEmployerCost),
      status: 'draft',
      remarks: input.remarks,
    };

    return await this.payrollRepository.create(payrollData);
  }

  async getAllPayrolls(): Promise<Payroll[]> {
    return await this.payrollRepository.findAll();
  }

  async getPayrollById(id: number): Promise<Payroll | undefined> {
    return await this.payrollRepository.findById(id);
  }

  async getPayrollsByEmployee(employeeId: number): Promise<Payroll[]> {
    return await this.payrollRepository.findByEmployee(employeeId);
  }

  async updatePayroll(id: number, data: Partial<NewPayroll>): Promise<Payroll | undefined> {
    return await this.payrollRepository.update(id, data);
  }

  async deletePayroll(id: number): Promise<Payroll | undefined> {
    return await this.payrollRepository.delete(id);
  }
}
