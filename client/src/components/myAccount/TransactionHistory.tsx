import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
  Search,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface Transaction {
  _id: string;
  transactionDate: string;
  type: 'withdrawal' | 'deposit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

interface TransactionHistoryProps {
  userEmail: string;
}

interface TransactionResponse {
  transactions: Transaction[];
  totalPages: number;
  totalTransactions: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ userEmail }) => {
  const dispatch = useDispatch();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTransactions, setTotalTransactions] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    if (userEmail) {
      fetchTransactionHistory();
    }
  }, [currentPage, userEmail]);

  const fetchTransactionHistory = async (): Promise<void> => {
    setIsLoading(true);
    setError("");
    try {
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: ITEMS_PER_PAGE.toString()
      });

      const encodedEmail = encodeURIComponent(userEmail.trim().toLowerCase());
      
      const response = await fetch(
        `/api/v1/transactions/${encodedEmail}?${queryParams.toString()}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch transactions');
      }

      const data: TransactionResponse = await response.json();
      
      setTransactions(data.transactions || []);
      setTotalPages(data.totalPages || 1);
      setTotalTransactions(data.totalTransactions || 0);
    } catch (err) {
      console.error('Transaction fetch error:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string | undefined): string => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-500/10 text-emerald-500";
      case "pending":
        return "bg-yellow-500/10 text-yellow-500";
      case "failed":
        return "bg-red-500/10 text-red-500";
      default:
        return "bg-zinc-500/10 text-zinc-500";
    }
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number | undefined): string => {
    if (typeof amount !== 'number') return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  if (!userEmail) {
    return (
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertCircle className="h-4 w-4 text-yellow-500" />
        <AlertDescription className="text-yellow-500">
          No user email provided. Please log in to view transactions.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card className="border-zinc-800/50 bg-zinc-900/50">
      <CardHeader className="pb-4">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <CardTitle className="text-xl font-semibold">
              Transaction History
            </CardTitle>
            <p className="mt-1 text-sm text-zinc-400">
              Manage and monitor your transaction history
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <Input
                placeholder="Search transactions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-full md:w-60 border-zinc-700/50 bg-zinc-800/50"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 border-zinc-700/50 bg-zinc-800/50">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex h-60 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
          </div>
        ) : error ? (
          <Alert className="border-red-500/20 bg-red-500/10">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <AlertDescription className="text-red-400">
              {error}
            </AlertDescription>
          </Alert>
        ) : transactions.length === 0 ? (
          <div className="flex h-60 flex-col items-center justify-center text-zinc-400">
            <Clock className="mb-2 h-8 w-8" />
            <p>No transactions found</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-lg border border-zinc-800">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 hover:bg-zinc-800/50">
                    <TableHead className="text-zinc-400">ID</TableHead>
                    <TableHead className="text-zinc-400">Date</TableHead>
                    <TableHead className="text-zinc-400">Type</TableHead>
                    <TableHead className="text-right text-zinc-400">Amount</TableHead>
                    <TableHead className="text-zinc-400">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow
                      key={transaction._id}
                      className="border-zinc-800 hover:bg-zinc-800/50"
                    >
                      <TableCell className="font-medium">
                        {transaction._id}
                      </TableCell>
                      <TableCell className="text-zinc-400">
                        {formatDate(transaction.transactionDate)}
                      </TableCell>
                      <TableCell>
                        <span className="capitalize">{transaction.type}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span
                          className={
                            transaction.type === "withdrawal"
                              ? "text-red-400"
                              : "text-emerald-400"
                          }
                        >
                          {transaction.type === "withdrawal" ? "-" : "+"}
                          {formatAmount(transaction.amount)}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={`${getStatusColor(
                            transaction.status
                          )} capitalize`}
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-zinc-400">
                Showing {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalTransactions)} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, totalTransactions)} of{" "}
                {totalTransactions} transactions
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => prev - 1)}
                  className="border-zinc-700/50 bg-zinc-800/50"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="border-zinc-700/50 bg-zinc-800/50"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;