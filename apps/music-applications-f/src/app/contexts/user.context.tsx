import { createContext, ReactNode, useState } from 'react';
import { User } from '../types';

export interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setCurrentUser: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const value = { currentUser, setCurrentUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
