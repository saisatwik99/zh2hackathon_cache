import { Router } from 'express';

import accountController from '../controllers/account.js';
import utils from '../utils/utils.js';

const router = Router();

router.post('/linkAccount', utils.verifyAuthToken, accountController.linkAccount);
router.get('/createAccount', utils.verifyAuthToken, accountController.getCreateAccount);
router.get('/home', utils.verifyAuthToken, accountController.getAccountDetails);
router.get('/getTransactions', utils.verifyAuthToken, accountController.getTransactions);
router.post('/sync', utils.verifyAuthToken, accountController.sync);
router.post('/unlinkAccount', utils.verifyAuthToken, accountController.unlinkAccount);

router.post('/create', accountController.createAccount);
router.post('/getBalance', accountController.getAccountBalance);

export default router;
