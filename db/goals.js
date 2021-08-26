import db from './db.js';
import ConflictError from '../utils/errors/conflictError.js';
import { ObjectId } from 'mongodb';

const goalsCollectionRef = () => db.get().collection('goals')

const addGoal = (goal) => {
    if(goal.targetamount === '' || goal.name === '' || goal.description === '' ) {
        return ConflictError("Fields Cannot be Empty");
    }
    return goalsCollectionRef().insertOne(goal);
}

const findGoal = async (goalID) => goalsCollectionRef().findOne({ _id: ObjectId(goalID) });

const updateGoal = (goal) => {
    if(goal.targetamount === '' && goal.name === '' && goal.description === '') {
        return ConflictError("Update Failed")
    }
    return goalsCollectionRef().findOneAndUpdate(
        {_id: ObjectId(goal.goalId)},
        { $set : {targetamount: goal.targetamount, description: goal.description,name: goal.name}}, 
        {returnNewDocument: true}
    )
}

const updateCompleteGoal = (goal) => goalsCollectionRef().findOneAndUpdate(
        {_id: ObjectId(goal._id)},
        { $set : {totalNav: goal.totalNav, payments: goal.payments}}, 
        {returnNewDocument: true}
    )


const getAllGoals = (user) => {
    return goalsCollectionRef().find({ userId: ObjectId(user._id) }).toArray();
}

const deleteGoal = (goalId) => goalsCollectionRef().findOneAndDelete({_id: ObjectId(goalId)})

export default {
    addGoal,
    updateGoal,
    getAllGoals,
    findGoal,
    updateCompleteGoal,
    deleteGoal
}
