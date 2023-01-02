import { CreateTransferController } from '../modules/transfers/useCases/createTransfer/CreateTransferController';
import { Router } from 'express';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const transfersRouter = Router();

const createTransferController = new CreateTransferController();

transfersRouter.use(ensureAuthenticated);

transfersRouter.post(
  '/:user_id',
  createTransferController.handle,
)

export { transfersRouter };
