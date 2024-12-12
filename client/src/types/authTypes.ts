export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    }
  
  export interface AuthState {
    user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  }
  