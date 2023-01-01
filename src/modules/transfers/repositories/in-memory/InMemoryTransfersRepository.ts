import { ICreateTransfersDTO } from '@modules/transfers/dtos/ICreateTransfersDTO';
import { Transfers } from '@modules/transfers/entities/Transfers';
import { ITransfersRepository } from '../ITransfersRepository';


class InMemoryTransfersRepository implements ITransfersRepository {
  transfers: Transfers[] = [];

  async create({
    user_id,
    description,
    send_id,
    amount,
  }: ICreateTransfersDTO): Promise<Transfers> {
    const transfer = new Transfers();

    Object.assign(transfer, {
      user_id,
      send_id,
      amount,
      description,
    });

    this.transfers.push(transfer);

    return transfer;
  }

}