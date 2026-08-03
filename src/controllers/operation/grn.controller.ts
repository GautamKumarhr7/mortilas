import { Request, Response, NextFunction } from 'express';
import { GRNRepository } from '../../repositories/operation/grn.repository.js';

export class GRNController {
  private grnRepository: GRNRepository;

  constructor() {
    this.grnRepository = new GRNRepository();
  }

  getAllGRNs = async (req: Request, res: Response, next: NextFunction) => {
    const data = await this.grnRepository.findAll();
    res.status(200).json({ success: true, data });
  };

  createFromPO = async (req: Request, res: Response, next: NextFunction) => {
    const { poId, receivedDate, storeManagerId, items } = req.body;

    if (!poId || !receivedDate) {
      return res
        .status(400)
        .json({ success: false, message: 'poId and receivedDate are required' });
    }

    if (Array.isArray(items)) {
      const invalidRating = items.find((item) => {
        if (item.employeeRating === undefined || item.employeeRating === null) {
          return false;
        }
        const rating = Number(item.employeeRating);
        return Number.isNaN(rating) || rating < 1 || rating > 5;
      });

      const invalidAveragePrice = items.find((item) => {
        if (item.averagePrice === undefined || item.averagePrice === null) {
          return false;
        }
        const price = Number(item.averagePrice);
        return Number.isNaN(price) || price < 0;
      });

      if (invalidRating) {
        return res
          .status(400)
          .json({ success: false, message: 'employeeRating must be between 1 and 5' });
      }

      if (invalidAveragePrice) {
        return res
          .status(400)
          .json({ success: false, message: 'averagePrice must be a non-negative number' });
      }
    }

    const grn = await this.grnRepository.createFromPO({
      poId: parseInt(String(poId), 10),
      receivedDate,
      storeManagerId: storeManagerId ? parseInt(String(storeManagerId), 10) : undefined,
      items,
    });

    res.status(201).json({ success: true, data: grn });
  };

  initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const { financeUserId } = req.body;

    const grn = await this.grnRepository.initiatePayment(
      parseInt(String(id), 10),
      financeUserId ? parseInt(String(financeUserId), 10) : undefined,
    );

    if (!grn) {
      return res.status(404).json({ success: false, message: 'GRN not found' });
    }

    res.status(200).json({ success: true, data: grn });
  };
}
