import { createContext, ReactNode, useEffect, useState } from 'react';
import { ItemPreview } from '../types';

interface RecentlyViewedContextType {
  recentlyViewed: ItemPreview[];
  addItem: (newItem: ItemPreview) => void;
}

export const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed: [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addItem: () => {},
});

export const RecentlyViewedContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [recentlyViewed, setRecentlyViewed] = useState<ItemPreview[]>(
    []
  );

  useEffect(() => {
    updateRecentlyViewedFromStorage();
  }, []);

  const updateRecentlyViewedFromStorage = () => {
    const unparsed = localStorage.getItem('recentlyViewedItems');
    if (unparsed) {
      setRecentlyViewed([...JSON.parse(unparsed)]);
    }
  };

  const addItem = (newItem: ItemPreview) => {
    if (
      !recentlyViewed.find(
        (value) => value.label === newItem.label && value.type === newItem.type
      )
    ) {
      let newArrayState = [];
      if (recentlyViewed.length === 3) {
        newArrayState = [...recentlyViewed.slice(1), { ...newItem }];
      } else {
        newArrayState = [...recentlyViewed, { ...newItem }];
      }
      setRecentlyViewed([...newArrayState]);
      localStorage.setItem(
        'recentlyViewedItems',
        JSON.stringify([...newArrayState])
      );
    }
  };

  const value = {
    recentlyViewed,
    addItem,
  };

  return (
    <RecentlyViewedContext.Provider value={value}>
      {children}
    </RecentlyViewedContext.Provider>
  );
};
