// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApplicationRouter from './components/navigation/navbar';
import './app-styles.scss';
import { UserContextProvider } from './contexts/user.context';
import { BrowserRouter } from 'react-router-dom';
import { RecentlyViewedContextProvider } from './contexts/recently-viewed.context';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { TaskContextProvider } from './contexts/task.context';

export function App() {
  return (
    <div className="application-wrapper">
      <BrowserRouter>
        <RecentlyViewedContextProvider>
          <UserContextProvider>
            <TaskContextProvider>
              <ApplicationRouter></ApplicationRouter>
            </TaskContextProvider>
          </UserContextProvider>
        </RecentlyViewedContextProvider>
        <ToastContainer></ToastContainer>
      </BrowserRouter>
    </div>
  );
}

export default App;
