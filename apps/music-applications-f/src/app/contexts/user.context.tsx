import { createContext, ReactNode, useEffect, useState } from 'react';
import { User } from '../types';
import { fetchUserProfileData } from '../requests';

export interface UserContextType {
  currentUser: User | null;
  currentTasks: AsyncNeo4jTaskMetadata[];
  addTask: (task: AsyncNeo4jTaskMetadata) => void;
  setUser: (accessToken: string | null) => void;
  signOut: () => void;
}

export const UserContext = createContext<UserContextType>({
  currentUser: null,
  currentTasks: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addTask: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setUser: () => {},
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  signOut: () => {},
});

interface AccessTokenMetadata {
  accessToken: string;
  receivedAt: number;
}

export interface AsyncNeo4jTaskMetadata {
  startedAt: number; // Date.now()
  finished: boolean;
  finishedIn?: number; // Date.now()
  failed: boolean;
  details: { name: string; type: string }[];
}

export const UserContextProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [currentTasks, setCurrentTasks] = useState<AsyncNeo4jTaskMetadata[]>(
    []
  );

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
      });
    }
  };

  const setUser = async (accessToken: string | null) => {
    if (accessToken) {
      await logInUser(accessToken);

      // store token in local storage exposes application to XSS attacks
      const receivedAt = new Date().getTime();
      console.log('store access token', accessToken);
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

  const addTask = (task: AsyncNeo4jTaskMetadata) =>
    setCurrentTasks([...currentTasks, task]);

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

  const value = { currentUser, currentTasks, addTask, setUser, signOut };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
