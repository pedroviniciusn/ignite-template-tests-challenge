import { Router } from 'express';

import { ShowUserProfileController } from '../modules/users/useCases/showUserProfile/ShowUserProfileController';
import { GetBalanceController } from '../modules/users/useCases/getBalance/GetBalanceController';
import { ensureAuthenticated } from '../shared/infra/http/middlwares/ensureAuthenticated';

const userProfileRouter = Router();

const showUserProfileController = new ShowUserProfileController();
const getBalanceController = new GetBalanceController();

userProfileRouter.use(ensureAuthenticated);

userProfileRouter.get('/', showUserProfileController.execute);
userProfileRouter.get('/balance', getBalanceController.execute);

export { userProfileRouter };
