import { UserRepository } from '../repositories/user.repository.js';
import { User, NewUser } from '../models/user.model.js';
import bcrypt from 'bcrypt';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return await this.userRepository.findAll();
  }

  async getUserById(id: number): Promise<User | undefined> {
    return await this.userRepository.findById(id);
  }

  async createUser(userData: NewUser): Promise<User> {
    const existingUser = await this.userRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const userToCreate = { ...userData, password: hashedPassword };
    return await this.userRepository.create(userToCreate);
  }

  async updateUser(id: number, userData: Partial<NewUser>): Promise<User | undefined> {
    return await this.userRepository.update(id, userData);
  }

  async deleteUser(id: number): Promise<User | undefined> {
    return await this.userRepository.delete(id);
  }
}
