import { Router } from 'express';

import accountController from '../controllers/account.js';
import utils from '../utils/utils.js';

const router = Router();

router.post('/linkAccount', utils.verifyAuthToken, accountController.linkAccount);
router.get('/linkAccount', utils.verifyAuthToken, accountController.getLinkAccount);
router.get('/home', utils.verifyAuthToken, accountController.getAccountDetails);
router.get('/getTransactions', utils.verifyAuthToken, accountController.getTransactions);
router.post('/sync', utils.verifyAuthToken, accountController.sync);
router.post('/unlinkAccount', utils.verifyAuthToken, accountController.unlinkAccount);

export default router;
