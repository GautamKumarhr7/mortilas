import { eq } from 'drizzle-orm';
import { db } from '../db/index.js';
import { users, User, NewUser } from '../models/hr/user.model.js';

export class UserRepository {
  async findAll(): Promise<User[]> {
    return await db.select().from(users);
  }

  async findById(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result[0];
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result[0];
  }

  async create(user: NewUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  async update(id: number, user: Partial<NewUser>): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ ...user, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<User | undefined> {
    const result = await db.delete(users).where(eq(users.id, id)).returning();
    return result[0];
  }
}
