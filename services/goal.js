import goalsDb from '../db/goals.js'

const addGoal = async (goal) => {
    await goalsDb.addGoal(goal);
    return goal;
}

const updateGoal = (goal) => {
   return goalsDb.updateGoal(goal);
}

const getAllGoals = (user) => {
    return goalsDb.getAllGoals(user);
}

export default {
    addGoal,
    updateGoal,
    getAllGoals
}
