import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Monitor, Calendar, DollarSign, Clock,
  AlertCircle, TrendingUp, Activity, Coins
} from "lucide-react";
import {
  fetchUserMachines,
  fetchProfitUpdateStatus,
  fetchUserTotalProfit
} from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch, RootState } from "@/lib/store/store";
import { 
  UserMachine, 
  ProfitUpdateStatus, 
  UserProfitSummary 
} from "@/types/userMachine"; 

interface MachineDisplayProps {
  machine: UserMachine & {
    machine?: {
      machineName?: string;
      model?: string;
    };
  }
}

const UserMachinesDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userMachines, isLoading, error } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [totalProfitData, setTotalProfitData] = React.useState<UserProfitSummary | null>(null);
  const [profitLoading, setProfitLoading] = React.useState(true);
  const [error1, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      console.log('=== Dashboard Mount ===');
      console.log('User data:', user);
      console.log('Is authenticated:', isAuthenticated);

      if (!user?.email || !isAuthenticated) {
        console.log('Missing user email or not authenticated');
        setProfitLoading(false);
        return;
      }

      try {
        setError(null);
        setProfitLoading(true);
        
        console.log('Fetching data for user:', user.email);
        
        const [machinesResult, profitResult] = await Promise.all([
          dispatch(fetchUserMachines(user.email)).unwrap(),
          dispatch(fetchUserTotalProfit(user.email)).unwrap()
        ]);
        
        setTotalProfitData(profitResult);
      } catch (err: any) {
        console.error("Error fetching data:", err);
        setError(err.message || 'Failed to fetch data');
      } finally {
        setProfitLoading(false);
      }
    };

    fetchData();
  }, [dispatch, user, isAuthenticated]);

  // Stats Overview Component
  const StatsOverview: React.FC<{ profitData: UserProfitSummary }> = ({ profitData }) => (
    <div className="mb-8 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Monitor className="h-5 w-5 text-[#21eb00]" />
            <h3 className="text-sm font-medium text-zinc-400">Total Machines</h3>
          </div>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          {profitData?.totalMachines || 0}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Coins className="h-5 w-5 text-[#21eb00]" />
            <h3 className="text-sm font-medium text-zinc-400">Total Profit</h3>
          </div>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          ${profitData?.totalProfit?.toFixed(2) || '0.00'}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#21eb00]" />
            <h3 className="text-sm font-medium text-zinc-400">Average per Machine</h3>
          </div>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          ${profitData?.totalMachines ? 
            (profitData.totalProfit / profitData.totalMachines).toFixed(2) : 
            '0.00'}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="h-5 w-5 text-[#21eb00]" />
            <h3 className="text-sm font-medium text-zinc-400">Active Rate</h3>
          </div>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          {profitData?.totalMachines && Array.isArray(userMachines) ? 
            `${((userMachines.filter(m => m.status === 'active').length / profitData.totalMachines) * 100).toFixed(0)}%` : 
            '0%'}
        </p>
      </div>
    </div>
  );

  const MachineCard: React.FC<MachineDisplayProps> = ({ machine }) => {
    const [profitStatus, setProfitStatus] = React.useState<ProfitUpdateStatus | null>(null);
    const [loading, setLoading] = React.useState(true);

    const calculateProgress = () => {
      if (!profitStatus) return 0;
      const daysLeft = profitStatus.daysUntilNextUpdate;
      return ((1 - daysLeft) / 1) * 100;
    };

    return (
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-black p-6 transition-all duration-500 hover:border-[#21eb00] hover:shadow-lg hover:shadow-[#21eb00]/10">
        <div className="absolute inset-0 bg-gradient-to-br from-[#21eb00]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="absolute right-6 top-6 h-20 w-20">
          {!loading && profitStatus && (
            <div className="relative h-full w-full">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#2A2A2A" strokeWidth="3" />
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
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-lg font-bold text-white">
                  {Math.max(0, Math.floor(profitStatus?.daysUntilNextUpdate || 0))}
                </span>
                <span className="text-xs text-zinc-400">days</span>
              </div>
            </div>
          )}
        </div>

        <div className="relative flex flex-col">
          <div className="mb-6 flex items-center space-x-2">
            <div className="flex items-center space-x-2 rounded-full bg-zinc-900/80 px-3 py-1.5">
              <div
                className={`h-2 w-2 rounded-full ${
                  machine.status === "active"
                    ? "animate-pulse bg-[#21eb00]"
                    : "bg-red-500"
                }`}
              />
              <span className="text-sm font-medium text-zinc-400">
                {machine.status}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="mb-1 text-xl font-semibold text-zinc-200 group-hover:text-white">
              Machine ID: {machine.machine}
            </h3>
            <div className="flex items-center space-x-2 text-sm text-zinc-500">
              <Monitor className="h-4 w-4" />
              <span>ID: {machine.machine}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 rounded-xl bg-zinc-900/50 p-3">
              <div className="flex items-center space-x-2 text-zinc-400">
                <DollarSign className="h-4 w-4 text-[#21eb00]" />
                <span className="text-sm">Accumulated</span>
              </div>
              <p className="text-lg font-semibold text-white">
                ${machine.monthlyProfitAccumulated?.toFixed(2) || "0.00"}
              </p>
            </div>

            <div className="space-y-2 rounded-xl bg-zinc-900/50 p-3">
              <div className="flex items-center space-x-2 text-zinc-400">
                <Clock className="h-4 w-4 text-[#21eb00]" />
                <span className="text-sm">Last Update</span>
              </div>
              <p className="text-sm font-medium text-white">
                {profitStatus
                  ? new Date(profitStatus.lastUpdateDate).toLocaleTimeString()
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-sm text-zinc-500">
            <div className="flex items-center space-x-1">
              <Calendar className="h-4 w-4" />
              <span>{new Date(machine.assignedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="mb-2 text-2xl font-semibold lg:text-3xl">
            Mining Dashboard
          </h2>
        </div>
        <p className="text-sm leading-relaxed text-zinc-400 lg:text-base">
          Monitor your mining machines performance and profit accumulation in real-time.
        </p>
      </div>

      {!profitLoading && totalProfitData && (
        <StatsOverview profitData={totalProfitData} />
      )}

      {error1 && (
        <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-red-500">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5" />
            <p>Error: {error1}</p>
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
              {isLoading ? "Loading machines..." : "No machines assigned yet."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserMachinesDashboard;