import { apiSlice } from '@/lib/store/apiSlice';
import { User } from '@/types/authTypes';
import { setUser } from './authSlice';
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface AuthResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (credentials) => ({
        url: '/api/v1/register',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(setUser(null));
        }
      }
    }),
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/api/v1/login',
        method: 'POST',
        body: credentials,
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(setUser(null));
        }
      }
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/api/v1/logout',
        method: 'POST',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch }) {
        dispatch(setUser(null));
      }
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: '/api/v1/me',
        method: 'GET',
        credentials: 'include',
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setUser(data));
        } catch {
          dispatch(setUser(null));
        }
      }
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApiSlice;