import { createContext, ReactNode, useState } from 'react';
import { User } from '../types';
import axios from 'axios';

export interface UserContextType {
  currentUser: User | null;
  setUser: (accessToken: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const setUser = async (accessToken: string | null) => {
    if (accessToken) {
      const response = await axios.get(
        `http://localhost:4200/api/currentUser`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setCurrentUser({
        accessToken: accessToken,
        username: response.data.username,
        password: response.data.password,
        email: response.data.email,
        gender: response.data.gender,
        id: response.data.id,
        dateOfBirth: response.data.dateOfBirth,
      });
    } else {
      setCurrentUser(null);
    }
  };
  const value = { currentUser, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
