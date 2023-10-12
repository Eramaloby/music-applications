import React, { useState } from 'react';
import './async-tasks-dashboard.styles.scss';
import { AsyncNeo4jTaskMetadata } from '../../../contexts/user.context';
import SingleTaskState from './single-task-state/single-task-state.component';

const AsyncTasksDashboard = ({
  tasks,
}: {
  tasks: AsyncNeo4jTaskMetadata[];
}) => {
  const [tasksState] = useState<AsyncNeo4jTaskMetadata[]>([...tasks]);

  return (
    <div className="dashboard-wrapper">
      {tasksState.length !== 0 ? (
        <>
          <div className="tasks-header">This sessions tasks:</div>
          <div className="dashboard-map-container">
            {tasksState.map((task, index) => {
              return (
                <div className="task-wrapper" key={index}>
                  <div className="current-state">
                    {task.finished ? 'Task in completed' : 'Task in process...'}
                  </div>
                  {task.finished && (
                    <div className="duration-time">
                      Task completion duration: {task.finishedIn}
                    </div>
                  )}
                  {task.details.length}
                </div>
              );
            })}
          </div>
        </>
      ) : (
        <div className="no-tasks-message">No tasks history</div>
      )}
    </div>
  );
};

export default AsyncTasksDashboard;
