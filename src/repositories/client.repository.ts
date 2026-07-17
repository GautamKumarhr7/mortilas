import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { clients, Client, NewClient } from "../models/client.model.js";

export class ClientRepository {
  async findAll(): Promise<Client[]> {
    return await db.select().from(clients);
  }

  async findById(id: number): Promise<Client | undefined> {
    const result = await db.select().from(clients).where(eq(clients.id, id));
    return result[0];
  }

  async findByEmail(email: string): Promise<Client | undefined> {
    const result = await db
      .select()
      .from(clients)
      .where(eq(clients.email, email));
    return result[0];
  }

  async create(client: NewClient): Promise<Client> {
    const result = await db.insert(clients).values(client).returning();
    return result[0];
  }

  async update(
    id: number,
    client: Partial<NewClient>,
  ): Promise<Client | undefined> {
    const result = await db
      .update(clients)
      .set({ ...client, updatedAt: new Date() })
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }

  async delete(id: number): Promise<Client | undefined> {
    const result = await db
      .delete(clients)
      .where(eq(clients.id, id))
      .returning();
    return result[0];
  }
}
