import React, { useEffect, useState } from 'react';
import { AsyncNeo4jTaskMetadata } from '../../../../contexts/user.context';
import './single-task-state.styles.scss';

// refactor or remove component
const SingleTaskState = ({ task }: { task: AsyncNeo4jTaskMetadata }) => {
  const [taskCopy, setTaskCopy] = useState<AsyncNeo4jTaskMetadata>(task);

  useEffect(() => {
    if (taskCopy.finished && !taskCopy.finishedIn) {
      taskCopy.finishedIn =
        Math.floor((Date.now() - taskCopy.startedAt) / 1000) + 1;
    }
  }, [taskCopy]);

  return (
    <div className="task-wrapper">
      <div className="current-state">
        {taskCopy.finished ? 'Task in completed' : 'Task in process...'}
      </div>
      {taskCopy.finished && (
        <div className="duration-time">
          Task completion duration: {taskCopy.finishedIn}
        </div>
      )}
      {/* view details button when task is complete */}
    </div>
  );
};

export default SingleTaskState;
