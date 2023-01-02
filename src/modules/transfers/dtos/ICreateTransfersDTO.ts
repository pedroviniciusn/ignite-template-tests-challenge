import { Transfers } from "../entities/Transfers";

export interface ICreateTransfersDTO {
  send_id: string;
  user_id: string;
  amount: number;
  description: string;
  type: string;
}
