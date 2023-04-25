import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../types';
import axios from 'axios';
import { Router, useNavigate } from 'react-router-dom';

export interface UserContextType {
  currentUser: User | null;
  setUser: (accessToken: string | null) => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
});

interface AccessTokenMetadata {
  accessToken: string;
  receivedAt: number;
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const router = useNavigate();

  const logInUser = async (accessToken: string) => {
    const response = await axios.get(`http://localhost:4200/api/currentUser`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setCurrentUser({
      accessToken: accessToken,
      username: response.data.username,
      password: response.data.password,
      email: response.data.email,
      gender: response.data.gender,
      id: response.data.id,
      dateOfBirth: response.data.dateOfBirth,
    });
  };

  const setUser = async (accessToken: string | null) => {
    if (accessToken) {
      await logInUser(accessToken);

      // store token in local storage exposes application to XSS attacks
      const receivedAt = new Date().getTime();
      localStorage.setItem(
        'tokenData',
        JSON.stringify({
          accessToken: accessToken,
          receivedAt: receivedAt,
        } as AccessTokenMetadata)
      );
    } else {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      const unparsed = localStorage.getItem('tokenData');
      if (unparsed) {
        const tokenMetadata = JSON.parse(unparsed) as AccessTokenMetadata;

        const elapsedTimeMinutes = Math.floor(
          (new Date().getTime() - tokenMetadata.receivedAt) / 60000
        );

        console.log('TIME SINCE TOKEN WAS REFRESHED:', elapsedTimeMinutes);

        if (elapsedTimeMinutes < 45) {
          await logInUser(tokenMetadata.accessToken);
          router('/profile');
        }
      }
    };

    asyncWrapper();
  }, []);

  const value = { currentUser, setUser };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
