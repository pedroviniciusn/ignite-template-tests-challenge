import { Transfers } from '../../transfers/entities/Transfers';
import { getRepository, Repository } from "typeorm";

import { Statement } from "../entities/Statement";
import { ICreateStatementDTO } from "../useCases/createStatement/ICreateStatementDTO";
import { IGetBalanceDTO } from "../useCases/getBalance/IGetBalanceDTO";
import { IGetStatementOperationDTO } from "../useCases/getStatementOperation/IGetStatementOperationDTO";
import { IStatementsRepository } from "./IStatementsRepository";

export class StatementsRepository implements IStatementsRepository {
  private repository: Repository<Statement>;
  private transferRepository: Repository<Transfers>;

  constructor() {
    this.repository = getRepository(Statement);
    this.transferRepository = getRepository(Transfers);
  }

  async create({
    user_id,
    amount,
    description,
    type
  }: ICreateStatementDTO): Promise<Statement> {
    const statement = this.repository.create({
      user_id,
      amount,
      description,
      type
    });

    return this.repository.save(statement);
  }

  async findStatementOperation({ statement_id, user_id }: IGetStatementOperationDTO): Promise<Statement | undefined> {
    return this.repository.findOne(statement_id, {
      where: { user_id }
    });
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

    const statement = await this.repository.find({
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
