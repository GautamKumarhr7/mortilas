import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/hr/user.repository.js';
import { VendorRepository } from '../repositories/businessDevelopment/vendor.repository.js';

const userRepository = new UserRepository();
const vendorRepository = new VendorRepository();

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized: Missing or invalid Bearer token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: any, type?: string };
    
    let user: any = null;
    if (decoded.type === 'vendor') {
      user = await vendorRepository.findById(decoded.userId as string);
    } else {
      user = await userRepository.findById(decoded.userId as number);
    }

    if (!user) {
      res.status(401).json({ success: false, message: 'Unauthorized: User or Vendor not found' });
      return;
    }

    req.user = user;
    if (decoded.type === 'vendor') {
      (req as any).isVendor = true;
    }
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Unauthorized: Invalid or expired token' });
  }
};
