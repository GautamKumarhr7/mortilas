import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required' });
      return;
    }

    const result = await this.authService.login(email, password);
    if (!result) {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
      return;
    }

    const { user, accessToken, refreshToken } = result;
    // Omit password from user response
    const { password: _, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      data: { user: userWithoutPassword, accessToken, refreshToken },
    });
  };

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, dob, pan, addhar } = req.body;
      if (!name || !email || !password || !dob || !pan || !addhar) {
        res.status(400).json({ success: false, message: 'Name, email, password, dob, PAN, and Aadhar are required' });
        return;
      }
      const user = await this.authService.register(req.body);
      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ success: true, data: userWithoutPassword, message: 'Registration successful' });
    } catch (error: any) {
      if (error.message === 'Email already registered') {
        res.status(409).json({ success: false, message: error.message });
      } else {
        next(error);
      }
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.body;
    if (!token) {
      res.status(400).json({ success: false, message: 'Refresh token is required' });
      return;
    }

    const result = await this.authService.refreshToken(token);
    if (!result) {
      res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
      return;
    }

    res.status(200).json({ success: true, data: result });
  };
}
