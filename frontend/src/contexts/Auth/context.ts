import React, {
  Dispatch,
  FunctionComponent,
  PropsWithChildren,
  createContext,
  useReducer,
} from 'react';
import { Types } from '../../types';
import { AuthState } from './types';
import { produce } from 'immer';

type AuthAction =
  | { type: 'auth/setCredentials'; payload: Types.User }
  | { type: 'auth/logout' };

const reducer: (state: AuthState, action: AuthAction) => AuthState = (
  state,
  action
) => {
  switch (action.type) {
    case 'auth/setCredentials':
      return produce(state, (draft) => {
        draft.userInfo = action.payload;
        localStorage.setItem('userInfo', JSON.stringify(action.payload));
      });
    case 'auth/logout':
      return produce(state, (draft) => {
        draft.userInfo = null;
        localStorage.removeItem('userInfo');
      });
    default:
      throw new Error('Invalid action');
  }
};

type AuthValue = AuthState;
type AuthDispatch = Dispatch<AuthAction>;

export const AuthValue = createContext<AuthValue | null>(null);
export const AuthDispatch = createContext<AuthDispatch | null>(null);

const initialState: AuthState = {
  userInfo: localStorage.getItem('userInfo')
    ? JSON.parse(localStorage.getItem('userInfo')!)
    : null,
};

export const AuthProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const valueProvider = React.createElement(AuthValue.Provider, {
    value: state,
    children,
  });
  const dispatchProvider = React.createElement(AuthDispatch.Provider, {
    value: dispatch,
    children: valueProvider,
  });

  return dispatchProvider;
};
