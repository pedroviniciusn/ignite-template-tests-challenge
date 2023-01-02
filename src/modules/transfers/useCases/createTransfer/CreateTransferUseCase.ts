import { autoInjectable, inject, injectable } from 'tsyringe';
import { Transfers } from '../../entities/Transfers';
import { ITransfersRepository } from '../../repositories/ITransfersRepository';
import { IUsersRepository } from '../../../users/repositories/IUsersRepository';
import { AppError } from '../../../../shared/errors/AppError';
import { IStatementsRepository } from '../../../statements/repositories/IStatementsRepository';

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
    
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}
  
  async execute({
    user_id,
    send_id,
    amount,
    description,
    type,
  }: IRequest): Promise<Transfers> {
    const user = await this.usersRepository.findById(send_id);

    const user_receive = await this.usersRepository.findById(user_id);

    if (!user_receive) {
      throw new AppError('User does not exists!');
    }

    const { balance } = await this.statementsRepository.getUserBalance({ user_id: user.id });

    if (balance < amount) {
      throw new AppError('Insufficient funds')
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
