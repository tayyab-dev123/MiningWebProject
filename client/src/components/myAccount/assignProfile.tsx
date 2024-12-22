'use client'
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Monitor, Calendar, DollarSign, Clock, Battery, AlertCircle, Zap } from 'lucide-react';
import { fetchUserMachines, fetchProfitUpdateStatus } from '@/lib/feature/userMachine/usermachineApi';
import { RootState } from '@/lib/store/store';

const UserMachinesDashboard = () => {
  const dispatch = useDispatch();
  const { userMachines, isLoading, error } = useSelector((state: RootState) => state.userMachine);
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.email && isAuthenticated) {
        try {
          await dispatch(fetchUserMachines(user.email)).unwrap();
        } catch (error) {
          console.error('Error fetching machines:', error);
        }
      }
    };
    fetchData();
  }, [dispatch, user, isAuthenticated]);

  const MachineCard = ({ machine }) => {
    const [profitStatus, setProfitStatus] = React.useState(null);
    const [loading, setLoading] = React.useState(true);

    useEffect(() => {
      const fetchProfitStatus = async () => {
        try {
          const result = await dispatch(fetchProfitUpdateStatus(machine._id)).unwrap();
          setProfitStatus(result);
          setLoading(false);
        } catch (error) {
          console.error('Error fetching profit status:', error);
          setLoading(false);
        }
      };
      fetchProfitStatus();
    }, [machine._id]);

    const calculateProgress = () => {
      if (!profitStatus) return 0;
      const daysLeft = profitStatus.daysUntilNextUpdate;
      return ((30 - daysLeft) / 30) * 100;
    };

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        
        {/* Enhanced Progress Circle */}
        <div className="absolute right-6 top-6 h-20 w-20">
          {!loading && profitStatus && (
            <div className="relative h-full w-full">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                {/* Background circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#2A2A2A"
                  strokeWidth="3"
                />
                {/* Progress circle */}
                <circle
                  cx="18"
                  cy="18"
                  r="16"
                  fill="none"
                  stroke="#21eb00"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${calculateProgress()}, 100`}
                  className="transition-all duration-700 ease-in-out"
                />
              </svg>
              {/* Central Text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white">
                  {profitStatus?.daysUntilNextUpdate}
                </span>
                <span className="text-xs text-zinc-400">days</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex flex-col">
          {/* Status Badge */}
          <div className="mb-6 flex items-center space-x-2">
            <div className="flex items-center space-x-2 rounded-full bg-zinc-900/80 px-3 py-1.5">
              <div className={`h-2 w-2 rounded-full ${
                machine.status === 'active' ? 'bg-[#21eb00] animate-pulse' : 'bg-red-500'
              }`} />
              <span className="text-sm font-medium text-zinc-400">
                {machine.status}
              </span>
            </div>
          </div>

          {/* Machine Info */}
          <div className="mb-6">
            <h3 className="mb-1 text-xl font-semibold text-zinc-200 transition-colors duration-300 group-hover:text-white">
              {machine.machine?.machineName || 'Machine Name N/A'}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-500">
              <Monitor className="h-4 w-4" />
              <span>{machine.machine?.model || 'Model N/A'}</span>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            {/* Accumulated Profit */}
            <div className="space-y-2 rounded-xl bg-zinc-900/50 p-3">
              <div className="flex items-center space-x-2 text-zinc-400">
                <DollarSign className="h-4 w-4 text-[#21eb00]" />
                <span className="text-sm">Accumulated</span>
              </div>
              <p className="text-lg font-semibold text-white">
                ${machine.monthlyProfitAccumulated?.toFixed(2) || '0.00'}
              </p>
            </div>

            {/* Monthly Profit */}
            <div className="space-y-2 rounded-xl bg-zinc-900/50 p-3">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Zap className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Monthly</span>
              </div>
              <p className="text-lg font-semibold text-white">
                ${machine.machine?.ProfitAdmin?.toFixed(2) || '0.00'}
              </p>
            </div>
          </div>

          {/* Bottom Stats */}
          <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(machine.assignedDate).toLocaleDateString()}
              </span>
            </div>
            {profitStatus && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>
                  Last Update: {new Date(profitStatus.lastUpdateDate).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-[#21eb00]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold lg:text-3xl">
            Your Mining Machines
            <span className="ml-2 text-sm text-zinc-500">
            </span>
          </h2>
          <div className="flex space-x-4">
            <div className="flex items-center space-x-2 rounded-lg bg-zinc-900/50 px-4 py-2">
              <Battery className="h-5 w-5 text-[#21eb00]" />
              <span className="text-sm text-zinc-400">
                {userMachines?.filter(m => m.status === 'active').length || 0} Active Machines
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400 lg:text-base">
          Track your mining machines performance and profit accumulation.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <p>Error: {error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {userMachines && userMachines.length > 0 ? (
          userMachines.map((machine) => (
            <MachineCard key={machine._id} machine={machine} />
          ))
        ) : (
          <div className="col-span-full flex min-h-[200px] items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/50">
            <p className="text-zinc-400">
              {isLoading 
                ? 'Loading machines...' 
                : 'No machines assigned yet.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMachinesDashboard;