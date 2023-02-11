import cl from './modal.module.css';
import React from 'react';

type AppModalProps = {
  children: React.ReactNode;
  visible: boolean;
  isHiddenOnClick: false;
  setVisible: (value: boolean) => void;
};

const AppModal = ({
  children,
  visible,
  setVisible,
  isHiddenOnClick,
}: AppModalProps) => {

  console.log('sdasd');
  const rootClasses = [cl['appModal']];

  if (visible) {
    rootClasses.push(cl['active']);
  }

  return (
    <div
      className={rootClasses.join(' ')}
      onClick={() => {
        if (!isHiddenOnClick) {
          setVisible(false);
        }
      }}
    >
      <div
        className={cl['appModalContent']}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default AppModal;
