import { Router } from 'express';

import userController from '../controllers/user.js';
import utils from '../utils/utils.js';
import validations from '../validations/user.js';

const {
  signUpValidate,
  loginValidate
} = validations;

const router = Router();

router.get('/signup', userController.getSignup);
router.post('/signUp', signUpValidate, userController.userSignUp);
router.get('/login', userController.getLogin);
router.post('/login', loginValidate, userController.userLogin);
router.get('/dashboard', utils.verifyAuthToken, userController.dashboard);
router.get('/bill-payments', utils.verifyAuthToken, userController.billPayments);
router.get('/bill-payments/mobile', utils.verifyAuthToken, userController.billMobile);
router.get('/accounts', utils.verifyAuthToken, userController.accounts);
router.post('/validateToken', userController.isTokenValid);
router.post('/logout', userController.logout);

router.use(utils.verifyAuthToken);
// all other routes to be added below

export default router;
