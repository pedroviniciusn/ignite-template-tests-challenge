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

export class TransfersRepository implements ITransfersRepository {
  private repository: Repository<Transfers>;

  constructor() {
    this.repository = getRepository(Transfers);
  }

  async create({
    user_id,
    description,
    send_id,
    amount,
  }: ICreateTransfersDTO): Promise<Transfers> {
    const transfer = this.repository.create({
      user_id,
      send_id,
      amount,
      description,
    });

    return this.repository.save(transfer);
  }
}