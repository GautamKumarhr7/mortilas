import { EmployeeRepository } from '../../repositories/employee.repository.js';
import { Employee, NewEmployee } from '../../models/hr/employee.model.js';

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: number): Promise<Employee | undefined> {
    return await this.employeeRepository.findById(id);
  }

  async createEmployee(employeeData: NewEmployee): Promise<Employee> {
    return await this.employeeRepository.create(employeeData);
  }

  async updateEmployee(
    id: number,
    employeeData: Partial<NewEmployee>,
  ): Promise<Employee | undefined> {
    return await this.employeeRepository.update(id, employeeData);
  }

  async deleteEmployee(id: number): Promise<Employee | undefined> {
    return await this.employeeRepository.delete(id);
  }
}
