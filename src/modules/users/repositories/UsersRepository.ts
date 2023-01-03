import { getRepository, Repository } from "typeorm";
import { User } from "../entities/User";
import { Transfers } from '../../transfers/entities/Transfers';
import { Statement } from '../../statements/entities/Statement';

import { ICreateUserDTO } from "../useCases/createUser/ICreateUserDTO";
import { IGetBalanceDTO } from '../useCases/getBalance/IGetBalanceDTO';
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;
  private statementRepository: Repository<Statement>;
  private transferRepository: Repository<Transfers>;

  constructor() {
    this.repository = getRepository(User);
    this.statementRepository = getRepository(Statement);
    this.transferRepository = getRepository(Transfers);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      email,
    });
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.repository.findOne(user_id);
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({ name, email, password });

    return this.repository.save(user);
  }

  async getUserBalance({ user_id, with_statement = false, with_transfer = false }: IGetBalanceDTO):
    Promise<
      { balance: number } | 
      { balance: number, statement: Statement[] } | 
      { balance: number, transfer: Transfers[] }  |
      { balance: number, statement: Statement[], transfer: Transfers[] } 
    >
  {
    
    const transfers = await this.transferRepository.find();

    const userTransfers = await this.transferRepository.find({
      where: [
        { user_id: user_id },
        { send_id: user_id },
      ]
    });

    const transferBalance = transfers.reduce((acc, transfer) => {
      if (transfer.user_id === user_id) {
        return acc + Number(transfer.amount);
      } else if (transfer.send_id === user_id) {
        return acc - Number(transfer.amount);
      } return acc;
    }, 0)

    const statement = await this.statementRepository.find({
      where: { user_id }
    });

    const statemendBalance = statement.reduce((acc, operation) => {
      if (operation.type === 'deposit') {
        return acc + Number(operation.amount);
      } else {
        return acc - Number(operation.amount);
      }
    }, 0)

    let balance = transferBalance + statemendBalance;
    console.log(balance)
    
    if (with_statement && !with_transfer) {
      return {
        statement,
        balance,
      }
    }

    if (!with_statement && with_transfer) {
      return {
        transfer: userTransfers,
        balance,
      }
    }

    if (with_statement && with_transfer) {
      return {
        statement,
        transfer: userTransfers,
        balance,
      }
    }

    return { balance }
  }
}
