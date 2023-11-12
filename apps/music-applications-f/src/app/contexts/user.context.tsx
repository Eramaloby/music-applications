import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../types';
import { fetchUserProfileData } from '../requests';

export interface UserContextType {
  currentUser: User | null;
  setUser: (accessToken: string | null) => void;
  signOut: () => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: () => {},
});

interface AccessTokenMetadata {
  accessToken: string;
  receivedAt: number;
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const logInUser = async (accessToken: string) => {
    const response = await fetchUserProfileData(accessToken);

    if (response) {
      setCurrentUser({
        ...currentUser,
        accessToken: accessToken,
        username: response.username,
        password: response.password,
        email: response.email,
        gender: response.gender,
        id: response.id,
        dateOfBirth: response.dateOfBirth,
        profileImageBase64: response.pictureBase64,
        nodesCount: response.nodesAddedCount,
        relationshipsCount: response.relationshipsAddedCount,
      });
    }
  };

  const setUser = async (accessToken: string | null) => {
    if (accessToken) {
      await logInUser(accessToken);

      // store token in local storage exposes application to XSS attacks
      const receivedAt = new Date().getTime();
      localStorage.setItem(
        'tokenData',
        JSON.stringify({
          accessToken,
          receivedAt,
        } as AccessTokenMetadata)
      );
    } else {
      setCurrentUser(null);
    }
  };

  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('tokenData');
  };

  useEffect(() => {
    const asyncWrapper = async () => {
      const unparsed = localStorage.getItem('tokenData');
      if (unparsed) {
        const tokenMetadata = JSON.parse(unparsed) as AccessTokenMetadata;
        const elapsedTimeMinutes = Math.floor(
          (new Date().getTime() - tokenMetadata.receivedAt) / 60000
        );

        if (elapsedTimeMinutes < 45) {
          await logInUser(tokenMetadata.accessToken);
        }
      }
    };

    asyncWrapper();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { currentUser, setUser, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
