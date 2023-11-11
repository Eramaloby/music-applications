import cl from './modal.module.css';
import React from 'react';
import { useEscapeKey } from '../../hooks/use-escape-key.hook';

type AppModalProps = {
  children: React.ReactNode;
  visible: boolean;
  isHiddenOnClick: boolean;
  setVisible: (value: boolean) => void;
};

const AppModal = ({
  children,
  visible,
  setVisible,
  isHiddenOnClick,
}: AppModalProps) => {
  const rootClasses = [cl['appModal']];

  if (visible) {
    rootClasses.push(cl['active']);
  }

  useEscapeKey(() => setVisible(false));

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
