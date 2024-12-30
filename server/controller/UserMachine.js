import UserMachine from '../model/UserMAchine.js';
import User from '../model/UserModel.js';
import MiningMachine from '../model/MiningMachine.js';
import mongoose from 'mongoose';

export const assignMachineToUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userId, machineId } = req.body;

    // Validate input
    if (!userId || !machineId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'User ID and Machine ID are required' });
    }

    // Check if user exists
    const user = await User.findById(userId).session(session);
    if (!user) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if machine exists
    const machine = await MiningMachine.findById(machineId).session(session);
    if (!machine) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'Machine not found' });
    }

    // Check if machine is already assigned
    const existingAssignment = await UserMachine.findOne({ 
      user: userId, 
      machine: machineId 
    }).session(session);

    if (existingAssignment) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'Machine already assigned to this user' });
    }

    // Create new user-machine assignment
    const userMachine = new UserMachine({
      user: userId,
      machine: machineId,
      assignedDate: new Date(),
      status: 'active'
    });

    await userMachine.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Populate the response with user and machine details
    const populatedUserMachine = await UserMachine.findById(userMachine._id)
      .populate('user', 'firstName lastName email')
      .populate('machine', 'machineName model');

    res.status(201).json(populatedUserMachine);
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Machine assignment error:', error);
    res.status(500).json({ 
      message: 'Error assigning machine to user',
      error: error.message 
    });
  }
};

export const getUserMachines = async (req, res) => {
  try {
    const userIdentifier = req.params.userId;

    if (!userIdentifier) {
      return res.status(400).json({ message: 'User identifier is required' });
    }

    let user;
    // Check if the identifier is a valid MongoDB ObjectId
    const isValidObjectId = mongoose.Types.ObjectId.isValid(userIdentifier);

    if (isValidObjectId) {
      user = await User.findById(userIdentifier);
    } else {
      // If not a valid ObjectId, search by email
      user = await User.findOne({ email: userIdentifier });
    }

    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        identifier: userIdentifier 
      });
    }

    // Now that we have the user, find their machines using the _id
    const userMachines = await UserMachine.find({ user: user._id })
      .populate('user', 'firstName lastName email')
      .populate('machine', 'machineName model');

    if (userMachines.length === 0) {
      return res.status(200).json([]); // Return empty array instead of 404
    }

    res.status(200).json(userMachines);
  } catch (error) {
    console.error('Error retrieving user machines:', error);
    res.status(500).json({ 
      message: 'Error retrieving user machines',
      error: error.message 
    });
  }
};

export const removeUserMachine = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userMachineId } = req.params;

    // Validate userMachineId
    if (!userMachineId) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'User Machine ID is required' });
    }

    // Find and remove the user-machine assignment
    const removedUserMachine = await UserMachine.findByIdAndDelete(userMachineId, { session });

    if (!removedUserMachine) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User Machine assignment not found' });
    }

    await session.commitTransaction();
    session.endSession();

    res.status(200).json({ 
      message: 'Machine assignment removed successfully',
      removedUserMachine 
    });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();

    console.error('Error removing user machine:', error);
    res.status(500).json({ 
      message: 'Error removing user machine assignment',
      error: error.message 
    });
  }
};

export const getAllUserMachines = async (req, res) => {
  try {
    // Find all user-machine assignments with populated details
    const userMachines = await UserMachine.find()
      .populate('user', 'firstName lastName email')
      .populate('machine', 'machineName model');

    res.status(200).json(userMachines);
  } catch (error) {
    console.error('Error retrieving all user machines:', error);
    res.status(500).json({ 
      message: 'Error retrieving all user machines',
      error: error.message 
    });
  }
};
export const getProfitUpdateStatus = async (req, res) => {
  try {
    const { userMachineId } = req.params;

    const userMachine = await UserMachine.findById(userMachineId)
      .populate('machine')
      .populate('user', 'firstName lastName email');

    if (!userMachine) {
      return res.status(404).json({ message: 'User machine assignment not found' });
    }

    const lastUpdate = userMachine.lastProfitUpdate || userMachine.assignedDate;
    const currentDate = new Date();
    // Changed from days to hours
    const hoursSinceUpdate = Math.floor((currentDate - lastUpdate) / (1000 * 60 * 60));

    res.status(200).json({
      userMachineId: userMachine._id,
      userName: `${userMachine.user.firstName} ${userMachine.user.lastName}`,
      machineName: userMachine.machine.machineName,
      lastUpdateDate: lastUpdate,
      hoursSinceLastUpdate: hoursSinceUpdate,
      hoursUntilNextUpdate: Math.max(0, 1 - hoursSinceUpdate), // Changed from 30 days to 1 hour
      currentAccumulatedProfit: userMachine.monthlyProfitAccumulated,
      status: userMachine.status
    });
  } catch (error) {
    console.error('Error getting profit update status:', error);
    res.status(500).json({ 
      message: 'Error getting profit update status',
      error: error.message 
    });
  }
};

export const updateMonthlyProfit = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userMachineId } = req.params;
    
    const userMachine = await UserMachine.findById(userMachineId)
      .populate('machine')
      .session(session);

    if (!userMachine) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User machine assignment not found' });
    }

    if (userMachine.status !== 'active') {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Machine is not active' });
    }

    // Calculate profit since assignment or last update
    const lastUpdate = userMachine.lastProfitUpdate || userMachine.assignedDate;
    const currentDate = new Date();
    
    // Calculate hours since last update
    const hoursSinceUpdate = Math.floor(
      (currentDate.getTime() - new Date(lastUpdate).getTime()) / (1000 * 60 * 60)
    );

    // Debug logging
    console.log('Profit Update Debug:', {
      machineId: userMachineId,
      lastUpdate: lastUpdate,
      currentDate: currentDate,
      hoursSinceUpdate: hoursSinceUpdate,
      currentAccumulatedProfit: userMachine.monthlyProfitAccumulated,
      machineProfit: userMachine.machine.ProfitAdmin
    });

    if (hoursSinceUpdate >= 1) {
      const profitPerHour = userMachine.machine.ProfitAdmin / 24; // Daily profit divided by 24 hours
      const profitToAdd = profitPerHour * hoursSinceUpdate;
      
      userMachine.monthlyProfitAccumulated += profitToAdd;
      userMachine.lastProfitUpdate = currentDate;

      await userMachine.save({ session });
      await session.commitTransaction();

      return res.status(200).json({
        message: 'Profit updated successfully',
        hoursProcessed: hoursSinceUpdate,
        profitAdded: profitToAdd,
        newTotal: userMachine.monthlyProfitAccumulated,
        nextUpdateIn: '1 hour'
      });
    } else {
      await session.commitTransaction();
      return res.status(200).json({
        message: 'Too soon for next update',
        minutesUntilNextUpdate: 60 - ((hoursSinceUpdate * 60) % 60),
        currentProfit: userMachine.monthlyProfitAccumulated
      });
    }
  } catch (error) {
    await session.abortTransaction();
    console.error('Profit update error:', error);
    return res.status(500).json({ 
      message: 'Error updating profit',
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};


export const manualProfitUpdate = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { userMachineId } = req.params;
    const { profitAmount } = req.body;

    if (!profitAmount || isNaN(profitAmount)) {
      await session.abortTransaction();
      return res.status(400).json({ message: 'Valid profit amount is required' });
    }

    const userMachine = await UserMachine.findById(userMachineId).session(session);

    if (!userMachine) {
      await session.abortTransaction();
      return res.status(404).json({ message: 'User machine assignment not found' });
    }

    userMachine.monthlyProfitAccumulated += Number(profitAmount);
    userMachine.lastProfitUpdate = new Date();

    await userMachine.save({ session });
    await session.commitTransaction();

    res.status(200).json({
      message: 'Profit manually updated successfully',
      profitAdded: profitAmount,
      newTotal: userMachine.monthlyProfitAccumulated
    });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error in manual profit update:', error);
    res.status(500).json({ 
      message: 'Error updating profit manually',
      error: error.message 
    });
  } finally {
    session.endSession();
  }
};