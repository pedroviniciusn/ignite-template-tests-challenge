import {
  getRepository,
  Repository,
} from 'typeorm';

import {
  Transfers,
} from '../entities/Transfers';

import {
  ICreateTransfersDTO,
} from '../dtos/ICreateTransfersDTO';

import {
  ITransfersRepository,
} from './ITransfersRepository';

enum OperationType {
  TRANSFERS = 'transfers'
}

export class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfers>;

  constructor() {
    this.repository = getRepository(Transfers);
  }

  async create({
    user_id,
    description,
    type,
    send_id,
    amount,
  }: ICreateTransfersDTO): Promise<Transfers> {
    const transfer = this.repository.create({
      user_id,
      description,
      send_id,
      amount,
      type: type as OperationType,
    });

    return this.repository.save(transfer);
  }
}