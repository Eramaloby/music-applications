import { createContext, ReactNode, useEffect, useState } from 'react';
import { RecentlyViewedItem } from '../types';


interface RecentlyViewedContextType {
  recentlyViewed : RecentlyViewedItem[];
  addItem: (newItem: RecentlyViewedItem) => void;
}

export const RecentlyViewedContext = createContext<RecentlyViewedContextType>({
  recentlyViewed : [],
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  addItem: () => {},
});


export const RecentlyViewedContextProvider = ({ children }: { children: ReactNode }) => {
  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedItem[]>([]);

  useEffect(() => {
    updateRecentlyViewedFromStorage();
  }, []);

  const updateRecentlyViewedFromStorage = () => {
    const unparsed = localStorage.getItem("recentlyViewedItems");
    if (unparsed) {
      setRecentlyViewed(JSON.parse(unparsed));
    }
  };

  const addItem = (newItem: RecentlyViewedItem) => {
    
    if (recentlyViewed.length === 3) {
      setRecentlyViewed([newItem, ...recentlyViewed.slice(0, 1)]);
    } else {
      setRecentlyViewed([newItem, ...recentlyViewed]);
    }
    localStorage.setItem("recentlyViewedItems", JSON.stringify([...recentlyViewed]));
    updateRecentlyViewedFromStorage();
  };

  const value = {
    recentlyViewed,
    addItem,
  };

  return (
  <RecentlyViewedContext.Provider value={value}>
    {children}
  </RecentlyViewedContext.Provider>);
}