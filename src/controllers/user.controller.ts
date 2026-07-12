import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service.js';

const excludePassword = (user: any) => {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    const users = await this.userService.getAllUsers();
    res.status(200).json({ success: true, data: users.map(excludePassword) });
  };

  getUserById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const user = await this.userService.getUserById(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: excludePassword(user) });
  };

  createUser = async (req: Request, res: Response, next: NextFunction) => {
    const user = await this.userService.createUser(req.body);
    res.status(201).json({ success: true, data: excludePassword(user) });
  };

  updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const user = await this.userService.updateUser(id, req.body);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, data: excludePassword(user) });
  };

  deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const user = await this.userService.deleteUser(id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'User deleted' });
  };
}
