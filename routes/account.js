import { Router } from 'express';

import accountController from '../controllers/account.js';
import utils from '../utils/utils.js';

const router = Router();

router.post('/linkAccount', utils.verifyAuthToken, accountController.linkAccount);
router.get('/linkAccount', utils.verifyAuthToken, accountController.getLinkAccount);
router.get('/home', utils.verifyAuthToken, accountController.getAccountDetails);
router.post('/sync', utils.verifyAuthToken, accountController.sync);
router.post('/unlinkAccount', utils.verifyAuthToken, accountController.unlinkAccount);

router.use(utils.verifyAuthToken);
router.post('/create', accountController.createAccount);
router.post('/getTransactions', accountController.getAccountTransactions);
router.post('/getBalance', accountController.getAccountBalance);
router.post('/getNetWorth', accountController.getNetWorth);

export default router;
