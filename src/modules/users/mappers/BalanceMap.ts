import { Statement } from "../../statements/entities/Statement";

import { Transfers } from '../../transfers/entities/Transfers';

export class BalanceMap {
  static toDTO({statement, transfer, balance}: { statement: Statement[], transfer: Transfers[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        type,
        created_at,
        updated_at
      }
    ));

    const parsedTransfer = transfer.map(({
      id,
      amount,
      description,
      user_id,
      send_id,
      user_send,
      user_receive,
      type,
      created_at,
      updated_at
    }) => (
      {
        id,
        amount: Number(amount),
        description,
        user_id,
        send_id,
        user_send,
        user_receive,
        type,
        created_at,
        updated_at
      }
    ));

    return {
      statement: parsedStatement,
      transfer: parsedTransfer,
      balance: Number(balance)
    }
  }
}
