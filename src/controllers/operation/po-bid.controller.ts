import { Request, Response, NextFunction } from 'express';
import { POBidRepository } from '../../repositories/operation/po-bid.repository.js';
import { NewPOBid } from '../../models/index.js';

export class POBidController {
  private poBidRepository: POBidRepository;

  constructor() {
    this.poBidRepository = new POBidRepository();
  }

  getPOBids = async (req: Request, res: Response, next: NextFunction) => {
    const { indentId } = req.params;
    const data = await this.poBidRepository.findByIndentId(parseInt(String(indentId), 10));
    res.status(200).json({ success: true, data });
  };

  getBidsByVendor = async (req: Request, res: Response, next: NextFunction) => {
    const { vendorId } = req.params;
    const data = await this.poBidRepository.findByVendorId(String(vendorId));
    res.status(200).json({ success: true, data });
  };

  createBid = async (req: Request, res: Response, next: NextFunction) => {
    const { indentId, vendorId, amount, materialAveragePrices } = req.body;

    if (!indentId || !vendorId || !amount) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    const bidData: NewPOBid = {
      indentId: parseInt(String(indentId), 10),
      vendorId,
      amount: amount.toString(),
      materialAveragePrices: Array.isArray(materialAveragePrices) ? materialAveragePrices : [],
    };

    const bid = await this.poBidRepository.create(bidData);
    res.status(201).json({ success: true, data: bid });
  };

  winBid = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const updatedBid = await this.poBidRepository.winBid(parseInt(String(id), 10));

    if (!updatedBid) {
      return res.status(404).json({ success: false, message: 'Bid not found' });
    }

    res.status(200).json({ success: true, data: updatedBid });
  };
}
