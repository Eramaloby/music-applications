import React, { useEffect, useState } from 'react';
import { AsyncNeo4jTaskMetadata } from '../../../contexts/user.context';
import './single-task-state.styles.scss';

// refactor or remove component
const SingleTaskState = ({ task }: { task: AsyncNeo4jTaskMetadata }) => {
  const [elapsedTime, setElapsedTime] = useState<number>(
    Math.floor((Date.now() - task.startedAt) / 1000)
  );

  useEffect(() => {
    let interval: string | number | NodeJS.Timeout | undefined;
    if (!task.finished) {
      interval = setInterval(() => setElapsedTime(elapsedTime + 1), 1000);
    }

    return () => clearInterval(interval);
  }, [elapsedTime, task.finished]);

  return (
    <div className="task-wrapper">
      <div className="current-state">
        {task.finished && task.finishedAt
          ? 'Task is completed'
          : `Task in process for ${elapsedTime} seconds`}
      </div>
      {task.finished && (
        <div className="task-finished-info">
          <div className="duration-time">
            Task completion duration:{' '}
            {Math.floor((task.finishedAt! - task.startedAt) / 1000)} seconds
          </div>
          <div className="nodes-cnt">Nodes count: {task.details.length}</div>
          <div className="rels-cnt">Relationships count: {task.relsCount}</div>
        </div>
      )}
      {/* view details button when task is complete */}
    </div>
  );
};

export default SingleTaskState;
