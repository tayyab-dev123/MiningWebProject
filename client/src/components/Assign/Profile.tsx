'use client'
import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  RefreshCw, 
  CheckCircle2,
  AlertTriangle 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

import { 
  fetchAllUserMachines, 
  updateMonthlyProfit,
  fetchProfitUpdateStatus 
} from '@/lib/feature/userMachine/usermachineApi';
import { useUpdateProfileMutation } from '@/lib/feature/auth/authThunk';

const UserMachineProfitUpdate: React.FC = () => {
  const dispatch = useDispatch();
  const [selectedUserMachine, setSelectedUserMachine] = useState('');
  const [profitAmount, setProfitAmount] = useState('');
  const [updateStatus, setUpdateStatus] = useState<any>(null);

  const { allUserMachines } = useUpdateProfileMutation(state => state.userMachine);

  // Fetch user machines on mount
  useEffect(() => {
    dispatch(fetchAllUserMachines());
  }, [dispatch]);

  // Fetch profit update status when a user machine is selected
  useEffect(() => {
    if (selectedUserMachine) {
      dispatch(fetchProfitUpdateStatus(selectedUserMachine))
        .then((response: any) => {
          setUpdateStatus(response.payload);
        });
    }
  }, [selectedUserMachine, dispatch]);

  const handleProfitUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedUserMachine) {
      toast.error('Please select a user machine', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    if (!profitAmount || isNaN(Number(profitAmount))) {
      toast.error('Please enter a valid profit amount', {
        position: "top-right",
        theme: "dark"
      });
      return;
    }

    try {
      await dispatch(updateMonthlyProfit({
        userMachineId: selectedUserMachine,
        profitAmount: Number(profitAmount)
      })).unwrap();

      toast.success('Profit updated successfully', {
        position: "top-right",
        theme: "dark"
      });

      // Reset form and refetch status
      setProfitAmount('');
      dispatch(fetchProfitUpdateStatus(selectedUserMachine))
        .then((response: any) => {
          setUpdateStatus(response.payload);
        });
    } catch (err: any) {
      toast.error(err.message || 'Failed to update profit', {
        position: "top-right",
        theme: "dark"
      });
    }
  };

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="p-6 border-b border-gray-700 flex items-center">
        <DollarSign className="w-8 h-8 text-green-500 mr-4" />
        <h2 className="text-2xl font-bold text-white">Update Machine Profit</h2>
      </div>

      <form onSubmit={handleProfitUpdate} className="p-6 space-y-4">
        <div>
          <label 
            htmlFor="userMachine" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Select User Machine
          </label>
          <select
            id="userMachine"
            value={selectedUserMachine}
            onChange={(e) => setSelectedUserMachine(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select a user machine</option>
            {allUserMachines?.map((um) => (
              <option key={um._id} value={um._id}>
                {um.user?.firstName} {um.user?.lastName} - {um.machine?.machineName}
              </option>
            ))}
          </select>
        </div>

        {selectedUserMachine && updateStatus && (
          <div className="bg-gray-700 rounded-lg p-4 space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-400">Current Accumulated Profit:</span>
              <span className="font-bold text-green-400">
                ${updateStatus.currentAccumulatedProfit?.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Days Since Last Update:</span>
              <span>{updateStatus.daysSinceLastUpdate} days</span>
            </div>
          </div>
        )}

        <div>
          <label 
            htmlFor="profitAmount" 
            className="block text-sm font-medium text-gray-300 mb-2"
          >
            Profit Amount
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <DollarSign className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              id="profitAmount"
              value={profitAmount}
              onChange={(e) => setProfitAmount(e.target.value)}
              className="w-full px-4 pl-10 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-green-500"
              placeholder="Enter profit amount"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center"
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Update Profit
        </button>
      </form>
    </div>
  );
};

export default UserMachineProfitUpdate;