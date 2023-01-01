import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { CreateTransferUseCase } from './CreateTransferUseCase';


export class CreateTransferController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { id: send_id } = req.user;

    const { id: user_id } = req.params;

    const {
      amount,
      description,
    } = req.body;

    const createTransferUseCase = container.resolve(CreateTransferUseCase);

    const transfer = await createTransferUseCase.execute({
      user_id,
      send_id,
      amount,
      description,
    });

    return res.json(transfer);
  }
}