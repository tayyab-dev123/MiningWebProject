import { User } from "./user";

export interface UserMachine {
  _id?: string;
  user: string | User;
  machine: string;
  assignedDate?: Date;
  monthlyProfitAccumulated: number;
  status?: "active" | "inactive";
}

export interface UserMachineState {
  userMachines: UserMachine[];
  allUserMachines: UserMachine[];
  profitUpdateStatus?: ProfitUpdateStatus | null;

  isLoading: boolean;
  error: string | null;
}

export interface AssignMachinePayload {
  userId: string;
  machineId: string;
}

export interface UpdateProfitPayload {
  userMachineId: string;
  profitAmount: number;
}

export interface ProfitUpdateStatus {
  userMachineId: string;
  userName: string;
  machineName: string;
  lastUpdateDate: Date;
  daysSinceLastUpdate: number;
  daysUntilNextUpdate: number;
  currentAccumulatedProfit: number;
  status: string;
}
