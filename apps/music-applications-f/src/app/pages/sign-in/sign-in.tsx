import { useState } from 'react';
import { UserSignInForm, UserSignInFormErrors } from '../../types';
import TextField from '@mui/material/TextField';

import './sign-in.styles.scss';
import { useNavigate } from 'react-router-dom';

export const SignInPage = () => {
  // states of form
  const [signInForm, setSignInForm] = useState<UserSignInForm>({
    password: '',
    username: '',
  });

  const [signInFormErrors, setSignInformErrors] =
    useState<UserSignInFormErrors>({
      password: '',
      username: '',
    });

  // handlers
  const handleUsernameChange = (username: string) => {
    setSignInForm({ ...signInForm, username: username });
    setSignInformErrors({ ...signInFormErrors, username: '' });
  };

  const handlePasswordChange = (password: string) => {
    setSignInForm({ ...signInForm, password: password });
    setSignInformErrors({
      ...signInFormErrors,
      password: '',
    });
  };

  const router = useNavigate();

  return (
    <div className="log-in-component-wrapper">
      <div className="log-in-title">Welcome to music_app</div>
      <div className="log-in-component">
        <div className="log-in-value">
          <div className="log-in-input-title">Enter your username</div>
          <TextField
            className="input-value"
            InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
            inputProps={{
              style: {
                color: 'white',
                fontWeight: '400',
                height: '15px',
              },
            }}
            color={'primary'}
            error={signInFormErrors.username ? true : false}
            label={`Enter your email`}
            value={signInForm.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            helperText={signInFormErrors.username}
          ></TextField>
        </div>
        <div className="log-in-value">
          <div className="log-in-password-title">Enter a password</div>
          <TextField
            className="input-value"
            InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
            inputProps={{ style: { height: '15px' } }}
            error={signInFormErrors.password ? true : false}
            label={'Enter your password'}
            type="password"
            value={signInForm.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            helperText={signInFormErrors.password}
          ></TextField>
        </div>
        <div className="log-in-link">
          You don't have an account?{' '}
          <span className="link" onClick={() => router('/signup')}>
            Sign Up
          </span>
        </div>
        <button className="log-in-button-sign-in">Sign In</button>
      </div>
    </div>
  );
};
