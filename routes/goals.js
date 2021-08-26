import { Router } from 'express';
import goalsController from '../controllers/goals.js';
import utils from '../utils/utils.js';
import goalValidate from '../validations/goal.js';

const router = Router();

router.use(utils.verifyAuthToken);
router.post('/addGoal', goalValidate ,goalsController.addGoal);
router.get('/addGoal', goalsController.getCreateGoal);
router.post('/updateGoal/:goalId',goalsController.updateGoal);
router.get('/getAllGoals', goalsController.getAllGoals);
router.get('/updateGoal/:goalId', goalsController.getUpdateGoal);
router.get('/details/:goalId', goalsController.getDetails);
router.get('/payGoal/:goalId', goalsController.payGoal);
router.post('/payGoal/:goalId', goalsController.payGoalPost);
router.get('/withdrawGoal/:goalId', goalsController.withdrawGoal);
router.post('/withdrawGoal/:goalId', goalsController.withdrawGoalPost);
router.get('/deleteGoal/:goalId', goalsController.deleteGoal);
router.post('/deleteGoal/:goalId', goalsController.deleteGoalPost);


export default router;
