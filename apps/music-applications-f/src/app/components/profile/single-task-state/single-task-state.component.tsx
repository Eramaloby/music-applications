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

  return (
    <div className="task-wrapper">
      <div className="current-state">
        {task.status === 'successful' ||
        (task.status === 'failed' && task.finishedAt)
          ? 'Task is completed'
          : `Task in process for ${elapsedSeconds} seconds`}
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
