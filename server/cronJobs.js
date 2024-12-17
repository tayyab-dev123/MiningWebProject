import cron from 'node-cron';
import UserMachine from './model/UserMAchine.js';
import mongoose from 'mongoose';

const BATCH_SIZE = 100; 

const updateMonthlyProfit = async (userMachineId) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const userMachine = await UserMachine.findById(userMachineId)
      .populate('machine')
      .session(session);

    if (!userMachine || userMachine.status !== 'active') {
      await session.abortTransaction();
      return;
    }

    const machineProfit = userMachine.machine.ProfitAdmin;
    const lastUpdate = userMachine.lastProfitUpdate || userMachine.assignedDate;
    const currentDate = new Date();
   
    const daysSinceUpdate = Math.floor(
      (currentDate - lastUpdate) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceUpdate >= 30) {
      const periodsToUpdate = Math.floor(daysSinceUpdate / 30);
     
      userMachine.monthlyProfitAccumulated += (machineProfit * periodsToUpdate);
      userMachine.lastProfitUpdate = new Date(
        currentDate - (daysSinceUpdate % 30) * 24 * 60 * 60 * 1000
      );

      await userMachine.save({ session });
      console.log(`Updated profit for machine ${userMachineId}: +${machineProfit * periodsToUpdate}`);
    }

    await session.commitTransaction();
    return { updated: daysSinceUpdate >= 30, userMachineId };
  } catch (error) {
    await session.abortTransaction();
    console.error(`Error updating profit for machine ${userMachineId}:`, error);
    return { updated: false, userMachineId, error };
  } finally {
    session.endSession();
  }
};

export const setupAutoProfitUpdates = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('Starting daily profit updates check...');
   
    try {
      const totalUserMachines = await UserMachine.countDocuments({ status: 'active' });
      console.log(`Total active user machines: ${totalUserMachines}`);

      for (let skip = 0; skip < totalUserMachines; skip += BATCH_SIZE) {
        const userMachines = await UserMachine.find({ status: 'active' })
          .populate('machine')
          .skip(skip)
          .limit(BATCH_SIZE);

        const updateResults = await Promise.all(
          userMachines.map(machine => updateMonthlyProfit(machine._id))
        );

        const updatedCount = updateResults.filter(result => result.updated).length;
        console.log(`Batch processed: ${updatedCount} machines updated`);
      }
     
      console.log('Daily profit updates completed');
    } catch (error) {
      console.error('Error in daily profit updates:', error);
    }
  });
};