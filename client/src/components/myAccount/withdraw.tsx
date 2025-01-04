import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Monitor,

  AlertCircle,
  TrendingUp,
  Activity,
  Coins,
  ArrowUpRight,
  Loader2
} from "lucide-react";
import { fetchUserTotalProfit } from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch, RootState } from "@/lib/store/store";
import WithdrawalDialog from "./withdrawForm";
import TransactionHistory from "./TransactionHistory";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserProfitSummary } from "@/types/userMachine";
interface StatsOverviewProps {
  profitData: UserProfitSummary;
}

const WithdrawalDashboard = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { userMachines, isLoading } = useSelector(
    (state: RootState) => state.userMachine
  );
  const { user, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );
  const [totalProfitData, setTotalProfitData] = useState<UserProfitSummary | null>(null);
  const [profitLoading, setProfitLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let retryTimeout: string | number | NodeJS.Timeout | undefined;

    const fetchData = async () => {
      if (!user?.email || !isAuthenticated) {
        setProfitLoading(false);
        return;
      }

      try {
        if (isMounted) {
          setError(null);
          setProfitLoading(true);
        }

        const profitResult = await dispatch(
          fetchUserTotalProfit(user.email)
        ).unwrap();

        if (isMounted && profitResult) {
          setTotalProfitData(profitResult);
          setIsInitialLoad(false);
          setRetryCount(0);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to fetch data");
          if (isInitialLoad && retryCount < 3) {
            setRetryCount((prev) => prev + 1);
            retryTimeout = setTimeout(() => {
              fetchData();
            }, 2000 * Math.pow(2, retryCount));
          }
        }
      } finally {
        if (isMounted) {
          setProfitLoading(false);
        }
      }
    };

    if (isAuthenticated || retryCount > 0) {
      fetchData();
    }

    return () => {
      isMounted = false;
      if (retryTimeout) {
        clearTimeout(retryTimeout);
      }
    };
  }, [dispatch, user?.email, isAuthenticated, retryCount]);

  // If not authenticated, show authentication required message
  if (!isAuthenticated) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-500">
          Please log in to view your mining dashboard.
        </AlertDescription>
      </Alert>
    );
  }

  // If authenticated but no user data yet, show loading
  if (!user) {
    return (
      <div className="flex h-60 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
      </div>
    );
  }

  const StatsOverview:React.FC<StatsOverviewProps> = ({ profitData }) => (
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
          ${profitData?.totalProfit?.toFixed(2) || "0.00"}
        </p>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-[#21eb00]" />
            <h3 className="text-sm font-medium text-zinc-400">
              Average per Machine
            </h3>
          </div>
        </div>
        <p className="mt-4 text-3xl font-semibold">
          ${profitData?.totalMachines
            ? (profitData.totalProfit / profitData.totalMachines).toFixed(2)
            : "0.00"}
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
          {profitData?.totalMachines
            ? `${((userMachines?.filter((m: { status: string; }) => m.status === "active").length /
                profitData.totalMachines) *
                100).toFixed(0)}%`
            : "0%"}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-semibold lg:text-3xl">
              Mining Dashboard
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400 lg:text-base">
              Monitor your mining machines performance and profit accumulation in
              real-time.
            </p>
          </div>
          {isAuthenticated && totalProfitData && (
            <WithdrawalDialog
              availableBalance={totalProfitData.totalProfit}
              userEmail={user.email}
            />
          )}
        </div>
      </div>

      {profitLoading ? (
        <div className="flex h-60 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
        </div>
      ) : (
        <>
          {totalProfitData && <StatsOverview profitData={totalProfitData} />}
          
          {/* Only render TransactionHistory if we have user email */}
          {user?.email && <TransactionHistory userEmail={user.email} />}

          {error && (
            <Alert className="border-red-500/20 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400">
                {error}
              </AlertDescription>
            </Alert>
          )}
        </>
      )}
    </div>
  );
};

export default WithdrawalDashboard;