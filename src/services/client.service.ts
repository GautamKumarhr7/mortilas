import { ClientRepository } from '../repositories/client.repository.js';
import { Client, NewClient } from '../models/client.model.js';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async getAllClients(): Promise<Client[]> {
    return await this.clientRepository.findAll();
  }

  async getClientById(id: number): Promise<Client | undefined> {
    return await this.clientRepository.findById(id);
  }

  async createClient(clientData: NewClient): Promise<Client> {
    const existingClient = await this.clientRepository.findByEmail(clientData.email);
    if (existingClient) {
      throw new Error('Client with this email already exists');
    }

    return await this.clientRepository.create(clientData);
  }

  async updateClient(id: number, clientData: Partial<NewClient>): Promise<Client | undefined> {
    if (clientData.email) {
      const existingClient = await this.clientRepository.findByEmail(clientData.email);
      if (existingClient && existingClient.id !== id) {
        throw new Error('Client with this email already exists');
      }
    }

    return await this.clientRepository.update(id, clientData);
  }

  async deleteClient(id: number): Promise<Client | undefined> {
    return await this.clientRepository.delete(id);
  }
}
