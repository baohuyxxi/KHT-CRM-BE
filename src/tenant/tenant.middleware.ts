import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // Nếu request đã có user từ JWT => gắn tenantId vào request
    if (req.user) {
      req['tenantId'] = req.user['tenantId'];
    }
    next();
  }
}
