import { autoInjectable, inject, injectable } from 'tsyringe';
import { Transfers } from '../../entities/Transfers';
import { ITransfersRepository } from '../../repositories/ITransfersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';

interface IRequest {
  user_id: string;
  send_id: string;
  type: string;
  amount: number;
  description: string;
}

@autoInjectable()
export class CreateTransferUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository,
  ) {}
  
  async execute({
    user_id,
    send_id,
    amount,
    description,
    type,
  }: IRequest): Promise<Transfers> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('User does not exists!');
    }

    const transfer = await this.transfersRepository.create({
      user_id,
      send_id,
      amount,
      description,
      type,
    });

    return transfer;
  }
}
