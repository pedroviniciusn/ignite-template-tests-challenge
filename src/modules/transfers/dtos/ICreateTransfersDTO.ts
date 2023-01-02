import { Transfers } from "../entities/Transfers";

export type ICreateTransfersDTO =
Pick<
  Transfers,
  'user_id' |
  'send_id' |
  'description' |
  'amount' |
  'type'
>
