import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';

enum OperationType {
  TRANSFERS = 'transfers'
}

export class CreateTransferController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: send_id } = req.user;

    const { user_id } = req.params;

    const {
      amount,
      description,
    } = req.body;

    const splittedPath = req.originalUrl.split('/')
    const type = splittedPath[splittedPath.length - 2] as OperationType;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      user_id,
      send_id,
      amount,
      description,
      type,
    });

    return res.json(transfer);
  }
}