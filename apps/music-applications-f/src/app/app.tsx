// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApplicationRouter from './components/ui-elements/navbar';
import './app-styles.scss';
import RegistrationComponent from './pages/registration/registartion';
import { UserContextProvider } from './contexts/user.context';

export function App() {
  return (
    <div className="application-wrapper">
      <UserContextProvider>
        <ApplicationRouter></ApplicationRouter>
      </UserContextProvider>
      {/* <RegistrationComponent /> */}
    </div>
  );
}

export default App;
