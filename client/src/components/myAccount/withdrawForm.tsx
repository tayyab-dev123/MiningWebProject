import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  DollarSign,
  Loader2,
  ArrowRight,
  AlertCircle,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { processWithdrawal } from "@/lib/feature/userMachine/usermachineApi";
import { AppDispatch } from "@/lib/store/store"; // Make sure to import AppDispatch

interface WithdrawalDialogProps {
  availableBalance: number;
  userEmail: string;
  onSuccess?: () => void;
}

const WithdrawalDialog: React.FC<WithdrawalDialogProps> = ({ 
  availableBalance, 
  userEmail, 
  onSuccess 
}) => {
  const [amount, setAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();

  const resetState = (): void => {
    setAmount("");
    setError("");
    setShowSuccess(false);
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (!open) {
      resetState();
    }
  };

  const validateAmount = (value: string): string | null => {
    const withdrawalAmount = parseFloat(value);
    if (isNaN(withdrawalAmount) || withdrawalAmount <= 0) {
      return "Please enter a valid amount";
    }
    if (withdrawalAmount > availableBalance) {
      return "Amount exceeds available balance";
    }
    return null;
  };

  const handleWithdrawal = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    const validationError = validateAmount(amount);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      await dispatch(
        processWithdrawal({
          email: userEmail,
          amount: parseFloat(amount),
        })
      ).unwrap();
      
      setShowSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
      
      setTimeout(() => {
        setIsOpen(false);
        resetState();
      }, 2000);
      
    } catch (err: any) {
      setError(err.message || "Failed to process withdrawal");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium shadow-lg transition-all duration-200 ease-in-out"
        >
          <DollarSign className="mr-2 h-5 w-5" />
          Withdraw Funds
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl text-emerald-50 font-semibold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            Withdraw Funds
          </DialogTitle>
          <DialogDescription className="mt-2">
            <div className="flex flex-col gap-1">
              <span className="text-zinc-400">Available Balance</span>
              <span className="text-lg font-semibold text-emerald-500">
                ${availableBalance?.toFixed(2)}
              </span>
            </div>
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-6 text-center">
            <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-emerald-500/20 p-2 text-emerald-500">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="mb-1 text-lg font-medium bg-emerald-500/20">Withdrawal Successful!</h3>
            <p className="text-zinc-400">
              Your withdrawal of ${parseFloat(amount).toFixed(2)} is being processed
            </p>
          </div>
        ) : (
          <form onSubmit={handleWithdrawal} className="mt-4 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="amount"
                className="text-sm font-medium text-zinc-300"
              >
                Withdrawal Amount
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400" />
                <Input
                  id="amount"
                  type="number"
                  placeholder="Enter amount"
                  value={amount}
                  onChange={(e) => {
                    setAmount(e.target.value);
                    setError("");
                  }}
                  min="0"
                  step="0.01"
                  disabled={isLoading}
                  className="pl-10 border-zinc-700/50 bg-[#000] focus:border-emerald-500 focus:ring-emerald-500 text-[#107f61] font-bold"
                />
              </div>
            </div>

            {error && (
              <Alert
                variant="destructive"
                className="border-red-500/20 bg-red-500/10"
              >
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="ml-2 text-red-400">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <DialogFooter>
              <div className="flex w-full flex-col gap-3">
                <Button
                  type="submit"
                  disabled={isLoading || !amount}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-medium h-11"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Confirm Withdrawal
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  disabled={isLoading}
                  onClick={() => setIsOpen(false)}
                  className="w-full text-zinc-400 hover:text-white hover:bg-zinc-800"
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WithdrawalDialog;