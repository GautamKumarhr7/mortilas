import { Request, Response, NextFunction } from 'express';
import { ClientService } from '../services/client.service.js';

export class ClientController {
  private clientService: ClientService;

  constructor() {
    this.clientService = new ClientService();
  }

  getAllClients = async (req: Request, res: Response, next: NextFunction) => {
    const clients = await this.clientService.getAllClients();
    res.status(200).json({ success: true, data: clients });
  };

  getClientById = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const client = await this.clientService.getClientById(id);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.status(200).json({ success: true, data: client });
  };

  createClient = async (req: Request, res: Response, next: NextFunction) => {
    const client = await this.clientService.createClient(req.body);
    res.status(201).json({ success: true, data: client });
  };

  updateClient = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const client = await this.clientService.updateClient(id, req.body);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.status(200).json({ success: true, data: client });
  };

  deleteClient = async (req: Request, res: Response, next: NextFunction) => {
    const id = parseInt(req.params.id as string, 10);
    const client = await this.clientService.deleteClient(id);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Client deleted' });
  };
}
