import { Transfers } from '../../transfers/entities/Transfers';
import { Statement } from '../../statements/entities/Statement';
import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';
import { IGetBalanceDTO } from '../useCases/getBalance/IGetBalanceDTO';

export interface IUsersRepository {
  create: (data: ICreateUserDTO) => Promise<User>;
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (user_id: string) => Promise<User | undefined>;
  getUserBalance: (data: IGetBalanceDTO) => Promise<
  { balance: number } | 
  { balance: number, statement: Statement[] } | 
  { balance: number, transfer: Transfers[] }  |
  { balance: number, statement: Statement[], transfer: Transfers[] } 
>;
}