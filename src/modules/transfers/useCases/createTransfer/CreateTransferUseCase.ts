import { Transfers } from '@modules/transfers/entities/Transfers';
import { ITransfersRepository } from '@modules/transfers/repositories/ITransfersRepository';
import { IUsersRepository } from '@modules/users/repositories/IUsersRepository';
import { AppError } from '@shared/errors/AppError';
import { inject, injectable } from 'tsyringe';

interface IRequest {
  user_id: string;
  send_id: string;
  amount: number;
  description: string;
}

injectable()
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
    });

    return transfer;
  }
}