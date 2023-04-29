// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApplicationRouter from './components/navigation/navbar';
import './app-styles.scss';
import { UserContextProvider } from './contexts/user.context';
import { BrowserRouter } from 'react-router-dom';
import { RecentlyViewedContextProvider } from './contexts/recently.viewed.content';

export function App() {
  return (
    <div className="application-wrapper">
      
      <BrowserRouter>
        <RecentlyViewedContextProvider>
        
          <UserContextProvider>
            <ApplicationRouter></ApplicationRouter>
          </UserContextProvider>
      </RecentlyViewedContextProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
