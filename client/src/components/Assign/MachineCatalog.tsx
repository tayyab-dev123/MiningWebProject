'use client'
import React, { useEffect, useState } from 'react';
import { 
  Trash2, 
  Server, 
  AlertTriangle, 
  Loader2, 
  RefreshCw 
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Imports from previous slices
import { 
  fetchAllUserMachines, 
  removeUserMachine 
} from '@/lib/feature/userMachine/usermachineApi';
import { UserMachine } from '@/types/userMachine';

const UserMachineList: React.FC = () => {
  const dispatch = useDispatch();
  const [userMachines, setUserMachines] = useState<UserMachine[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user machines on component mount
  useEffect(() => {
    const loadUserMachines = async () => {
      try {
        setIsLoading(true);
        const response = await dispatch(fetchAllUserMachines()).unwrap();
        setUserMachines(response);
        setError(null);
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to fetch user machines';
        setError(errorMessage);
        toast.error(errorMessage, {
          position: "top-right",
          theme: "dark"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadUserMachines();
  }, [dispatch]);

  // Handle machine removal
  const handleRemoveMachine = async (userMachineId: string) => {
    if (!window.confirm('Are you sure you want to remove this machine assignment?')) {
      return;
    }

    try {
      await dispatch(removeUserMachine(userMachineId)).unwrap();
      
      // Optimistically remove from local state
      setUserMachines(prev => 
        prev.filter(um => um._id !== userMachineId)
      );

      toast.success('Machine assignment removed successfully', {
        position: "top-right",
        theme: "dark"
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to remove machine assignment';
      toast.error(errorMessage, {
        position: "top-right",
        theme: "dark"
      });
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-300">Loading user machine assignments...</p>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="bg-red-900/20 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
        <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-red-400 mb-4 text-center">{error}</p>
        <button 
          onClick={() => dispatch(fetchAllUserMachines())}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </button>
      </div>
    );
  }

  // Render empty state
  if (userMachines.length === 0) {
    return (
      <div className="bg-gray-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
        <Server className="w-12 h-12 text-gray-500 mb-4" />
        <p className="text-gray-300 text-center">No machine assignments found</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700">
      <div className="p-6 border-b border-gray-700 flex items-center">
        <Server className="w-8 h-8 text-secondary mr-4" />
        <h2 className="text-2xl font-bold text-white">Machine Assignments</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-700 text-gray-300">
            <tr>
              <th className="p-4 text-left">User</th>
              <th className="p-4 text-left">Machine</th>
              <th className="p-4 text-left">Assigned Date</th>
              <th className="p-4 text-left">Monthly Profit</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {userMachines.map((assignment) => (
              <tr 
                key={assignment._id} 
                className="border-b border-gray-700 hover:bg-gray-700/50 transition-colors"
              >
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {assignment.user?.firstName} {assignment.user?.lastName}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {assignment.user?.email}
                    </span>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex flex-col">
                    <span className="font-semibold text-white">
                      {assignment.machine?.machineName}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {assignment.machine?.model}
                    </span>
                  </div>
                </td>
                <td className="p-4 text-gray-300">
                  {new Date(assignment.assignedDate).toLocaleDateString()}
                </td>
                <td className="p-4 text-green-500 font-semibold">
                  ${assignment.monthlyProfitAccumulated?.toFixed(2) || '0.00'}
                </td>
                <td className="p-4 text-center">
                  <button 
                    onClick={() => handleRemoveMachine(assignment._id)}
                    className="text-red-500 hover:text-red-600 transition-colors"
                    title="Remove Assignment"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserMachineList;