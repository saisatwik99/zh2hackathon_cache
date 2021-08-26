import moment from 'moment';
import { ObjectId } from 'mongodb';
import responder from '../utils/responseHandler.js';
import goalService from '../services/goal.js';
import goalUtils from '../utils/goal.js';
import goalDb from '../db/goals.js';

const goalImages = [
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-16_j7qqww.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-17_nvkvze.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-18_p0n9ly.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-13_ifuduf.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-14_umkgwy.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600107/Goals/img-15_j2wag4.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-10_bh0mtm.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-7_jqoydk.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-12_tfc1fz.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-8_f16mjh.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-11_s4wzpm.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600106/Goals/img-9_ogacsd.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-1_ij418d.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-2_xeyugi.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-3_kdpgmi.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-4_pmytrp.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-6_zvjdwm.jpg',
  'https://res.cloudinary.com/dpyeb9ref/image/upload/v1628600105/Goals/img-6_zvjdwm.jpg'
];

const addGoal = async (req, res, next) => {
  try {
    const {
      name, targetAmount, description, timePeriod
    } = req.body;
    const { user } = req;
    const payments = [];
    const currDate = new Date();
    const end = new Date();
    end.setMonth(end.getMonth() + +timePeriod);
    const goal = {
      targetAmount,
      name,
      description,
      userId: user._id,
      totalNav: 0,
      timePeriod,
      payments,
      startDate: currDate,
      endDate: end,
      goalImage: goalImages[Math.floor(Math.random() * 18)]
    };
    await goalService.addGoal(goal);

    res.redirect('/api/goals/getAllGoals');
  } catch (err) {
    return next(err);
  }
};

const getCreateGoal = (req, res) => {
  res.render('createGoal');
};

const getUpdateGoal = async (req, res) => {
  const { goalId } = req.params;
  const goalDetails = await goalDb.findGoal(goalId);

  res.render('modifyGoal', { goalDetails });
};

const updateGoal = async (req, res, next) => {
  try {
    const {
      body: {
        targetAmount, name, description, timePeriod
      }
    } = req;
    const { goalId } = req.params;
    const { user } = req;
    const goal = {
      goalId,
      targetAmount,
      name,
      description,
      timePeriod,
      userId: user._id
    };
    await goalService.updateGoal(goal);

    res.redirect('/api/goals/getAllGoals');
  } catch (err) {
    return next(err);
  }
};

const getAllGoals = async (req, res) => {
  const { user } = req;
  const goals = await goalService.getAllGoals(user);
  const modifiedGoals = await Promise.all(goals.map(async (goal) => {
    const investedAmount = await goalUtils.getTotalNavValue(goal.totalNav);

    const progressBar = Math.floor((investedAmount * 100) / goal.targetAmount).toString();
    return {
      goalId: goal._id,
      name: goal.name,
      description: goal.description,
      startDate: moment(goal.startDate).format('D MMM, YY'),
      endDate: moment(goal.endDate).format('D MMM, YY'),
      budget: goal.targetAmount,
      saved: investedAmount.toFixed(2),
      yetToSave: (goal.targetAmount - investedAmount).toFixed(2),
      progressBar: `width-${progressBar}`,
      progress: Math.floor((investedAmount * 100) / goal.targetAmount),
      goalImage: goal.goalImage
    };
  }));
  let isGreater = 0;
  if (modifiedGoals.length > 1) isGreater = 1;
  const isOdd = modifiedGoals.length % 2;
  let lastGoal = {};
  if (isOdd) {
    lastGoal = modifiedGoals[modifiedGoals.length - 1];
  }
  let halfLen = modifiedGoals.length;
  if (modifiedGoals.length % 2 !== 0) halfLen = modifiedGoals.length - 1;

  res.render('goalHome', {
    modifiedGoals, isOdd, lastGoal, isGreater, halfLen
  });
};

const getDetails = async (req, res) => {
  const { goalId } = req.params;
  const goalDetails = await goalDb.findGoal(goalId);
  const investedAmount = await goalUtils.getTotalNavValue(goalDetails.totalNav);
  const progressBar = Math.floor((investedAmount * 100) / goalDetails.targetAmount).toString();
  const goal = {
    id: goalId,
    name: goalDetails.name,
    desc: goalDetails.description,
    startDate: moment(goalDetails.startDate).format('D MMM, YY'),
    endDate: moment(goalDetails.endDate).format('D MMM, YY'),
    budget: goalDetails.targetAmount,
    saved: investedAmount.toFixed(2),
    yetToSave: (goalDetails.targetAmount - investedAmount).toFixed(2),
    noTrans: goalDetails.payments.length,
    payments: goalDetails.payments.reverse(),
    progressBar: `width-${progressBar}`,
    progress: Math.floor((investedAmount * 100) / goalDetails.targetAmount),
    goalImage: goalDetails.goalImage
  };
  res.render('goalDetails', { goal });
};

const payGoal = (req, res) => {
  const { goalId } = req.params;
  res.render('paymentGoal', { goalId });
};

const payGoalPost = async (req, res) => {
  const { goalId } = req.params;
  const { amount, paymentDetails } = req.body;
  const goalDetails = await goalDb.findGoal(goalId);
  const navValue = await goalUtils.getNavValue();
  const navAlloted = amount / navValue;
  goalDetails.payments.push({
    paymentDate: moment(new Date()).format('D MMM, YYYY'),
    paymentAmount: amount,
    status: 'Credit',
    paymentDetails: `Paid from ${paymentDetails}`,
    paymentId: Math.floor(Math.random() * 10000000000000),
    mfDetails: {
      navAlloted,
      unitPrice: navValue

    }
  });
  goalDetails.totalNav += navAlloted;
  await goalDb.updateCompleteGoal(goalDetails);
  res.redirect('/api/goals/getAllGoals');
};

const withdrawGoal = (req, res) => {
  const { goalId } = req.params;
  res.render('withdrawGoal', { goalId });
};

const withdrawGoalPost = async (req, res) => {
  const { goalId } = req.params;
  const { amount, paymentDetails } = req.body;
  const goalDetails = await goalDb.findGoal(goalId);
  const navValue = await goalUtils.getNavValue();
  const navSold = amount / navValue;

  if (goalDetails.totalNav * navValue - amount < 0) {
    res.redirect(`/api/goals/withdrawGoal/${ObjectId(goalId).toString()}`);
    return;
  }

  goalDetails.payments.push({
    paymentDate: moment(new Date()).format('D MMM, YYYY'),
    paymentAmount: amount,
    status: 'Debit',
    paymentDetails: `Paid to ${paymentDetails}`,
    paymentId: Math.floor(Math.random() * 10000000000000),
    mfDetails: {
      navSold,
      unitPrice: navValue

    }
  });
  goalDetails.totalNav -= navSold;
  await goalDb.updateCompleteGoal(goalDetails);
  res.redirect('/api/goals/getAllGoals');
};

const deleteGoal = async (req, res) => {
  const { goalId } = req.params;
  const goalDetails = await goalDb.findGoal(goalId);
  const navValue = await goalUtils.getNavValue();
  if (goalDetails.totalNav === 0) {
    await goalDb.deleteGoal(goalId);
    return res.redirect('/api/goals/getAllGoals');
  }
  res.render('deleteGoal', { goalId, totalAmount: (navValue * goalDetails.totalNav) });
};

const deleteGoalPost = async (req, res) => {
  const { goalId } = req.params;
  const { paymentDetails } = req.body;
  await goalDb.deleteGoal(goalId);

  res.redirect('/api/goals/getAllGoals');
};

export default {
  addGoal,
  getCreateGoal,
  updateGoal,
  getAllGoals,
  getUpdateGoal,
  getDetails,
  payGoal,
  payGoalPost,
  withdrawGoal,
  withdrawGoalPost,
  deleteGoal,
  deleteGoalPost
};
