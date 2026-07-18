import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository.js';
import { User } from '../models/hr/user.model.js';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(
    email: string,
    passwordString: string,
  ): Promise<{ user: User; accessToken: string; refreshToken: string } | null> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      return null;
    }

    const isValidPassword = await bcrypt.compare(passwordString, user.password);
    if (!isValidPassword) {
      return null;
    }

    const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1d',
    });
    const refreshToken = jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: '7d',
    });

    return { user, accessToken, refreshToken };
  }

  async register(data: any): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    
    const newUser = await this.userRepository.create({
      ...data,
      password: hashedPassword,
      type: 'applicant',
      designationId: 0,
      roleId: 0,
      dob: data.dob || new Date('2000-01-01').toISOString().split('T')[0], // required field
    });

    return newUser;
  }

  async refreshToken(token: string): Promise<{ accessToken: string } | null> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as {
        userId: number;
      };
      const user = await this.userRepository.findById(decoded.userId);

      if (!user) {
        return null;
      }

      const accessToken = jwt.sign({ userId: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '15m',
      });
      return { accessToken };
    } catch (error) {
      return null;
    }
  }
}
