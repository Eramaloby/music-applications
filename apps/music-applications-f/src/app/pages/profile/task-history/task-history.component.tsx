import React, { useState } from 'react';
import { FulfilledTask } from '../../../types';
import './task-history.styles.scss';
import AppModal from '../../../components/ui-elements/modal';

interface TaskDetail {
  name: string;
  type: string;
}

const TaskHistoryItem = ({ item }: { item: FulfilledTask }) => {
  const [detailsModal, setDetailsModal] = useState(false);

  const closeModal = () => setDetailsModal(false);

  const retryInsertion = async (id: string, type: string) => {
    return;
  };

  // TODO: add view in db route

  return (
    <div className="task-history-wrapper">
      <div className={'is-successful ' + (item.successful ? '' : 'error')}>
        {item.successful ? 'Task is completed' : 'Task is failed'}
      </div>
      {item.reason !== 'Success' ? (
        <div className="details">
          Insertion of {item.targetRecordType} was cancelled because:{' '}
          {item.details}
        </div>
      ) : (
        <div className="details">
          Insertion of <span>{item.targetRecordType}</span> was successful.
          Click button below to get moreindex detailed information.
        </div>
      )}
      <button
        className="view-details-btn"
        type="button"
        onClick={() => setDetailsModal(true)}
      >
        View details
      </button>

      <hr></hr>

      <AppModal
        visible={detailsModal}
        setVisible={setDetailsModal}
        isHiddenOnClick={false}
      >
        <div className="details-wrapper">
          {item.successful ? (
            <div className="successful-task-details">
              <div className="details-header">
                Nodes:{' '}
                <span>{(JSON.parse(item.details) as TaskDetail[]).length}</span>
                ; Relationships: <span>{item.relationshipCount}</span>
                <br></br>
                Records added:
              </div>
              <div className="details">
                {(JSON.parse(item.details) as TaskDetail[]).map((detail, index) => {
                  return (
                    <div className="detail" key={index}>
                      Type: <span>{detail.type}</span>; Name:{' '}
                      <span>{detail.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="failed-task-details">
              <div className="reason">Reason for failing: {item.reason}</div>
              <button
                type="button"
                className="retry-btn"
                onClick={() =>
                  retryInsertion(item.targetRecordId, item.targetRecordType)
                }
              >
                Retry
              </button>
            </div>
          )}
        </div>
      </AppModal>
    </div>
  );
};

export default TaskHistoryItem;
