import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';


import { RootState } from '@/lib/store/store';
import { UpdateProfitPayload,UserMachine, 
    UserMachineState, 
    AssignMachinePayload, 
    ProfitUpdateStatus} from '@/types/userMachine';

// Async Thunks
export const assignMachineToUser = createAsyncThunk<
  UserMachine, 
  AssignMachinePayload, 
  { state: RootState, rejectValue: string }
>(
  'userMachine/assignMachine',
  async ({ userId, machineId }, { rejectWithValue }) => {
    try {
      const response = await axios.post<UserMachine>('/api/v1/assign', { 
        userId, 
        machineId 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign machine');
    }
  }
);
// In usermachineApi.ts

export const fetchUserMachines = createAsyncThunk<
  UserMachine[], 
  string,  // This can be either userId or email
  { state: RootState, rejectValue: string }
>(
  'userMachine/fetchUserMachines',
  async (userIdentifier, { rejectWithValue }) => {
    try {
      console.log('Fetching with identifier:', userIdentifier);
      const response = await axios.get<UserMachine[]>(`/api/v1/userMachine/${userIdentifier}`);
      console.log('Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Full error:', error);
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user machines');
    }
  }
);
export const updateMonthlyProfit = createAsyncThunk<
  UserMachine, 
  UpdateProfitPayload, 
  { state: RootState, rejectValue: string }
>(
  'userMachine/updateProfit',
  async ({ userMachineId, profitAmount }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<UserMachine>(`/api/v1/profit/${userMachineId}`, { 
        profitAmount 
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update profit');
    }
  }
);

export const removeUserMachine = createAsyncThunk<
  string, 
  string, 
  { state: RootState, rejectValue: string }
>(
  'userMachine/removeMachine',
  async (userMachineId, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/v1/${userMachineId}`);
      return userMachineId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove machine');
    }
  }
);

export const fetchAllUserMachines = createAsyncThunk<
  UserMachine[], 
  void, 
  { state: RootState, rejectValue: string }
>(
  'userMachine/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<UserMachine[]>('/api/v1/admin/all');
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch all user machines');
    }
  }
);

export const fetchProfitUpdateStatus = createAsyncThunk<
  ProfitUpdateStatus, 
  string, 
  { state: RootState, rejectValue: string }
>(
  'userMachine/fetchProfitUpdateStatus',
  async (userMachineId, { rejectWithValue }) => {
    try {
      const response = await axios.get<ProfitUpdateStatus>(`/api/v1/profit/update-status/${userMachineId}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch profit update status');
    }
  }
);


// Initial State
const initialState: UserMachineState = {
  userMachines: [],
  allUserMachines: [],
  isLoading: false,
  error: null
};

// Slice
const userMachineSlice = createSlice({
  name: 'userMachine',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Assign Machine
    builder.addCase(assignMachineToUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(assignMachineToUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userMachines.push(action.payload);
    });
    builder.addCase(assignMachineToUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to assign machine';
    });

    // Fetch User Machines
    builder.addCase(fetchUserMachines.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchUserMachines.fulfilled, (state, action) => {
      state.isLoading = false;
      state.userMachines = action.payload;
    });
    builder.addCase(fetchUserMachines.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch user machines';
    });

    // Fetch All User Machines
    builder.addCase(fetchAllUserMachines.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllUserMachines.fulfilled, (state, action) => {
      state.isLoading = false;
      state.allUserMachines = action.payload;
    });
    builder.addCase(fetchAllUserMachines.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload || 'Failed to fetch all user machines';
    });

    // Update Monthly Profit
    builder.addCase(updateMonthlyProfit.fulfilled, (state, action) => {
      const index = state.userMachines.findIndex(
        (um) => um._id === action.payload._id
      );
      if (index !== -1) {
        state.userMachines[index] = action.payload;
      }
    });

    // Remove User Machine
    builder.addCase(removeUserMachine.fulfilled, (state, action) => {
      state.userMachines = state.userMachines.filter(
        (um) => um._id !== action.payload
      );
    });
  }
});

export const { clearError } = userMachineSlice.actions;
export default userMachineSlice.reducer;