import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import { postItemToNeo4j, postItemToNeo4jCustom } from '../requests';
import { UserContext } from './user.context';
import { Neo4jModel } from '../types';

export interface AsyncNeo4jTaskMetadata {
  startedAt?: number; // Date.now()
  finishedAt?: number; // Date.now()
  status: 'pending' | 'process' | 'successful' | 'failed';
  details: { name: string; type: string }[];
  relationshipsCount: number;
  accessTokenInvocation: string;
  itemType: 'album' | 'playlist' | 'track' | 'genre' | 'artist';
  spotifyId: string;
  model?: Neo4jModel;
}

export interface TaskContextType {
  queueTask: (
    itemType: string,
    spotify_id: string,
    accessToken: string
  ) => void;
  queueUserTask: (
    itemType: string,
    model: Neo4jModel,
    accessToken: string
  ) => void;
  tasks: AsyncNeo4jTaskMetadata[];
}

export const TaskContext = createContext<TaskContextType>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  queueTask: () => {},
  tasks: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  queueUserTask: () => {},
});

export const TaskContextProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<AsyncNeo4jTaskMetadata[]>([]);
  const { updateCurrentUser } = useContext(UserContext);
  const [isExecuting, setIsExecuting] = useState<boolean>(false);

  const startOperation = async (task: AsyncNeo4jTaskMetadata) => {
    setIsExecuting(true);

    task.startedAt = Date.now();
    let response;
    if (task.spotifyId === '' && task.model) {
      response = await postItemToNeo4jCustom(
        task.itemType,
        task.model,
        task.accessTokenInvocation
      );
    } else {
      response = await postItemToNeo4j(
        task.itemType,
        task.spotifyId,
        task.accessTokenInvocation
      );
    }

    if (response) {
      if (response.isSuccess) {
        task.status = 'successful';
        task.finishedAt = Date.now();
        toast.success(
          `${
            task.itemType.charAt(0).toUpperCase() + task.itemType.slice(1)
          } and related instances were added to db.`,
          { position: 'top-center' }
        );

        task.details = [...response.records];
        task.relationshipsCount = response.relsCount;
      } else {
        task.status = 'failed';
        task.finishedAt = Date.now();
        toast.error(`Operation was terminated. Message: ${response.message}`);
      }
    }

    setIsExecuting(false);
    await updateCurrentUser();
  };

  const queueTask = (
    itemType: string,
    spotify_id: string,
    accessToken: string
  ) => {
    const pendingTask = {
      status: 'pending',
      details: [],
      relationshipsCount: 0,
      accessTokenInvocation: accessToken,
      itemType: itemType,
      spotifyId: spotify_id,
    } as AsyncNeo4jTaskMetadata;

    if (isExecuting) {
      toast.info(
        'Operation in queue...\nCheck profile page to track pending operations.',
        {
          position: 'top-center',
        }
      );
    } else {
      // change state of task from pending to in process and start execution
      pendingTask.status = 'process';
      toast.info(
        `Operation was started...\nCheck profile page to track operations.`,
        { position: 'top-center' }
      );

      startOperation(pendingTask);
    }

    setTasks([...tasks, pendingTask]);
  };

  const queueUserTask = (
    itemType: string,
    model: Neo4jModel,
    accessToken: string
  ) => {
    const pendingTask = {
      status: 'pending',
      details: [],
      relationshipsCount: 0,
      accessTokenInvocation: accessToken,
      itemType: itemType,
      spotifyId: '',
      model: model,
    } as AsyncNeo4jTaskMetadata;

    if (isExecuting) {
      toast.info(
        'Operation in queue...\nCheck profile page to track pending operations.',
        {
          position: 'top-center',
        }
      );
    } else {
      // change state of task from pending to in process and start execution
      pendingTask.status = 'process';
      toast.info(
        `Operation was started...\nCheck profile page to track operations.`,
        { position: 'top-center' }
      );

      startOperation(pendingTask);
    }

    setTasks([...tasks, pendingTask]);
  };

  useEffect(() => {
    if (!isExecuting) {
      // take first pending task from queue
      const taskRef = tasks.find((task) => task.status === 'pending');
      if (taskRef) {
        taskRef.status = 'process';
        startOperation(taskRef);
      }
    }
  }, [isExecuting]);

  const value = { queueTask, queueUserTask, tasks };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};
