import React, { useEffect, useState } from 'react';
import './single-task-state.styles.scss';
import { AsyncNeo4jTaskMetadata } from '../../../contexts/task.context';

const SingleTaskState = ({ task }: { task: AsyncNeo4jTaskMetadata }) => {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(
    task.status === 'process'
      ? Math.floor((Date.now() - task.startedAt!) / 1000)
      : 0
  );

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (task.status === 'process') {
      interval = setInterval(() => setElapsedSeconds(elapsedSeconds + 1), 1000);
    }

    return () => clearInterval(interval);
  }, [elapsedSeconds, task.status]);

  // TODO: add more metadata about instance that is going to be added to db, and display it in panel current state
  // add button to view task details after it either finished or failed
  return (
    <div className="task-wrapper">
      <div className="current-state">
        {task.status === 'successful' && 'Task was completed successfully'}
        {task.status === 'pending' && 'Task is queued.'}
        {task.status === 'failed' && 'Task exited execution with error'}
        {task.status === 'process' && `Task in progress for ${elapsedSeconds}`}
      </div>
      {task.finishedAt && task.startedAt && (
        <div className="task-finished-info">
          <div className="duration-time">
            Task completion duration:{' '}
            {Math.floor((task.finishedAt - task.startedAt) / 1000)} seconds
          </div>
          <div className="nodes-cnt">Nodes count: {task.details.length}</div>
          <div className="rels-cnt">
            Relationships count: {task.relationshipsCount}
          </div>
        </div>
      )}
      {/* view details button when task is complete */}
    </div>
  );
};

export default SingleTaskState;
