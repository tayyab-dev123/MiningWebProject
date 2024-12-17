import { User } from '@/types/user';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
    setCredentials: (state, action: PayloadAction<User>) => {
      // Ensure we keep all user fields from the login response
      state.user = {
        ...action.payload,
        _id: action.payload._id,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        email: action.payload.email,
        role: action.payload.role,
      };
      state.isAuthenticated = true;
      
      // Debug log
      console.log('Auth State Updated:', {
        user: state.user,
        isAuthenticated: state.isAuthenticated
      });
    },
  },
});

export const { setUser, logout , setCredentials } = authSlice.actions;
export default authSlice.reducer;