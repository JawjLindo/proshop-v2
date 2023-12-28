import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { AuthState } from './types';
import { Types } from '../../types';

type AuthActions = {
  setCredentials: (user: Types.User) => void;
  logout: () => void;
};

type Auth = AuthState & AuthActions;

export const useAuth = create<Auth>()(
  devtools(
    persist(
      immer((set) => ({
        setCredentials: (user) => {
          set(
            (state: AuthState) => {
              state.userInfo = user;
            },
            false,
            'setCredentials'
          );
        },
        logout: () => {
          set(
            (state: AuthState) => {
              state.userInfo = null;
            },
            false,
            'logout'
          );
        },
      })),
      {
        name: 'Auth',
      }
    ),
    { name: 'ProShop', store: 'Auth' }
  )
);
