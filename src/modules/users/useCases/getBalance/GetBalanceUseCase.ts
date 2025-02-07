import { Transfers } from '../../../transfers/entities/Transfers';
import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../repositories/IUsersRepository";
import { Statement } from "../../../statements/entities/Statement";
import { IStatementsRepository } from "../../../statements/repositories/IStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";

interface IRequest {
  user_id: string;
}

interface IResponse {
  statement: Statement[];
  transfer: Transfers[];
  balance: number;
}

@injectable()
export class GetBalanceUseCase {
  constructor(
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  async execute({ user_id }: IRequest): Promise<IResponse> {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new GetBalanceError();
    }

    const balance = await this.usersRepository.getUserBalance({
      user_id,
      with_statement: true,
      with_transfer: true
    });

    return balance as IResponse;
  }
}
