// eslint-disable-next-line @typescript-eslint/no-unused-vars
import ApplicationRouter from './components/ui-elements/navbar';
import './app-styles.scss';
import RegistrationComponent from './pages/registration/registartion';

export function App() {
  return (
    <div className="application-wrapper">
      <RegistrationComponent />
    </div>
  );
}

export default App;
