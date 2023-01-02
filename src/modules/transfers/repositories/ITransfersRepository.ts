import { Transfers } from '@modules/transfers/entities/Transfers';
import { ICreateTransfersDTO } from '@modules/transfers/dtos/ICreateTransfersDTO';

export interface ITransfersRepository {
  create({
    user_id,
    description,
    send_id,
    amount,
    type,
  }: ICreateTransfersDTO): Promise<Transfers>;
}
