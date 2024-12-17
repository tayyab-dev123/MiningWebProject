// app/dashboard/machines/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState, AppDispatch } from '@/lib/store/store';
import { UserMachine } from '@/types/userMachine';
import { fetchUserMachines, removeUserMachine } from '@/lib/feature/userMachine/usermachineApi';

export default function UserMachineDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { userMachines, isLoading, error } = useSelector((state: RootState) => state.userMachine);
  const [selectedMachine, setSelectedMachine] = useState<UserMachine | null>(null);

  useEffect(() => {
    // Assuming you have a way to get the current user's ID
    const userId = 'current-user-id'; 
    dispatch(fetchUserMachines(userId));
  }, [dispatch]);

  const handleRemoveMachine = (userMachineId: string) => {
    dispatch(removeUserMachine(userMachineId));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Mining Machines</h1>
      
      {userMachines.length === 0 ? (
        <div className="text-center py-10 bg-gray-100 rounded-lg">
          <p className="text-gray-600">No machines assigned yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userMachines.map((machine) => (
            <div 
              key={machine._id} 
              className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">
                    {machine.machine.machineName}
                  </h2>
                  <span className="text-sm text-green-600 font-medium">
                    Active
                  </span>
                </div>
                
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <span className="font-medium">Assigned Date:</span>{' '}
                    {new Date(machine.assignedDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-medium">Monthly Profit:</span>{' '}
                    ${machine.monthlyProfitAccumulated?.toFixed(2) || '0.00'}
                  </p>
                </div>
                
                <div className="mt-6 flex space-x-4">
                  <button 
                    onClick={() => setSelectedMachine(machine)}
                    className="flex-1 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors"
                  >
                    View Details
                  </button>
                  <button 
                    onClick={() => handleRemoveMachine(machine._id)}
                    className="flex-1 bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
                  >
                    Remov
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Machine Details Modal (optional) */}
      {selectedMachine && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">
              {selectedMachine.machine.machineName} Details
            </h2>
            <div className="space-y-2">
              <p>
                <strong>Model:</strong> {selectedMachine.machine.model}
              </p>
              <p>
                <strong>Total Accumulated Profit:</strong> 
                ${selectedMachine.monthlyProfitAccumulated?.toFixed(2) || '0.00'}
              </p>
              {/* Add more details as needed */}
            </div>
            <div className="mt-6 flex justify-end space-x-4">
              <button 
                onClick={() => setSelectedMachine(null)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}