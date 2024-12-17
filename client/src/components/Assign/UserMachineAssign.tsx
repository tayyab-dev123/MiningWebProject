'use client'
import React, { useState, useCallback } from 'react';
import { 
  Server, 
  UserCircle2, 
  CheckCircle2, 
  AlertTriangle,
  Loader2,
  RefreshCw
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';

// Existing imports
import { 
  useGetAllMiningMachinesQuery, 
} from '@/lib/feature/Machines/miningMachinesApiSlice';
import { assignMachineToUser } from '@/lib/feature/userMachine/usermachineApi';
import { useUsers } from '@/hooks/Userdetail';

const UserMachineAssignment: React.FC = () => {
    const dispatch = useDispatch();
    const [selectedUser, setSelectedUser] = useState('');
    const [selectedMachine, setSelectedMachine] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { 
      data: machinesResponse = { data: [] }, 
      isLoading: machinesLoading, 
      error: machinesError,
      refetch: refetchMachines
    } = useGetAllMiningMachinesQuery();
    
    const { 
      users = [], 
      isLoading: usersLoading, 
      error: usersError,
      refetch: refetchUsers
    } = useUsers();
  
    const machines = machinesResponse.data || [];

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
      e.preventDefault();
      
      // Comprehensive input validation
      if (!selectedUser) {
        toast.error('Please select a user', {
          position: "top-right",
          theme: "dark"
        });
        return;
      }

      if (!selectedMachine) {
        toast.error('Please select a machine', {
          position: "top-right",
          theme: "dark"
        });
        return;
      }

      setIsSubmitting(true);

      try {
        await dispatch(assignMachineToUser({
          userId: selectedUser,
          machineId: selectedMachine
        })).unwrap();
        
        toast.success('Machine assigned successfully', {
          position: "top-right",
          theme: "dark"
        });
        
        // Reset form
        setSelectedUser('');
        setSelectedMachine('');
      } catch (err: any) {
        // More detailed error handling
        const errorMessage = err.response?.data?.message || 
                             err.message || 
                             'Failed to assign machine';
        
        toast.error(errorMessage, {
          position: "top-right",
          theme: "dark"
        });
      } finally {
        setIsSubmitting(false);
      }
    }, [dispatch, selectedUser, selectedMachine]);

    // Render loading state
    if (machinesLoading || usersLoading) {
      return (
        <div className="bg-gray-800 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
          <p className="text-gray-300">Loading resources...</p>
        </div>
      );
    }

    // Render error state
    if (machinesError || usersError) {
      return (
        <div className="bg-red-900/20 rounded-2xl p-6 min-h-[400px] flex flex-col items-center justify-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-400 mb-4 text-center">
            {machinesError ? 'Failed to load machines' : 'Failed to load users'}
          </p>
          <div className="flex space-x-4">
            <button 
              onClick={() => machinesError ? refetchMachines() : refetchUsers()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 transform transition-all hover:scale-[1.01]">
        <div className="p-6 border-b border-gray-700 flex items-center">
          <Server className="w-8 h-8 text-secondary mr-4" />
          <h2 className="text-2xl font-bold text-white">Assign Machine</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {/* User Selection */}
            <div>
              <label 
                htmlFor="user" 
                className="block text-sm font-medium text-gray-300 mb-2 flex items-center"
              >
                <UserCircle2 className="w-5 h-5 mr-2 text-gray-500" />
                Select User
              </label>
              <select
                id="user"
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={isSubmitting}
              >
                <option value="" className="bg-gray-800">Choose a user...</option>
                {users?.map((user) => (
                  <option 
                    key={user._id} 
                    value={user._id} 
                    className="bg-gray-800"
                  >
                    {user.firstName} {user.lastName} ({user.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Machine Selection */}
            <div>
              <label 
                htmlFor="machine" 
                className="block text-sm font-medium text-gray-300 mb-2 flex items-center"
              >
                <Server className="w-5 h-5 mr-2 text-gray-500" />
                Select Machine
              </label>
              <select
                id="machine"
                value={selectedMachine}
                onChange={(e) => setSelectedMachine(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-blue-500 transition-all"
                disabled={isSubmitting}
              >
                <option value="" className="bg-gray-800">Choose a machine...</option>
                {machines.map((machine) => (
                  <option 
                    key={machine._id} 
                    value={machine._id} 
                    className="bg-gray-800"
                  >
                    {machine.machineName}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className={`
                w-full 
                text-white 
                py-3 
                px-4 
                rounded-lg 
                transition-all 
                flex 
                items-center 
                justify-center
                ${isSubmitting 
                  ? 'bg-gray-600 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700 active:scale-[0.98]'}
              `}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Assigning...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 mr-2" />
                  Assign Machine
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    );
  };

export default UserMachineAssignment;