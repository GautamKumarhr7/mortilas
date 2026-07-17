import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service.js';

export class EmployeeController {
  private employeeService: EmployeeService;

  constructor() {
    this.employeeService = new EmployeeService();
  }

  getAllEmployees = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employees = await this.employeeService.getAllEmployees();
      res.status(200).json({ success: true, data: employees });
    } catch (error) {
      next(error);
    }
  };

  getEmployeeById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const employee = await this.employeeService.getEmployeeById(id);
      if (!employee) {
        res.status(404).json({ success: false, message: 'Employee not found' });
        return;
      }
      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      next(error);
    }
  };

  createEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const employee = await this.employeeService.createEmployee(req.body);
      res.status(201).json({ success: true, data: employee });
    } catch (error) {
      next(error);
    }
  };

  updateEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const employee = await this.employeeService.updateEmployee(id, req.body);
      if (!employee) {
        res.status(404).json({ success: false, message: 'Employee not found' });
        return;
      }
      res.status(200).json({ success: true, data: employee });
    } catch (error) {
      next(error);
    }
  };

  deleteEmployee = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id as string, 10);
      const employee = await this.employeeService.deleteEmployee(id);
      if (!employee) {
        res.status(404).json({ success: false, message: 'Employee not found' });
        return;
      }
      res.status(200).json({ success: true, message: 'Employee deleted' });
    } catch (error) {
      next(error);
    }
  };
}
