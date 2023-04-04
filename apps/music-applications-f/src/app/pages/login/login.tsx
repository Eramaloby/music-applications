import { useState } from 'react';
import { UserSignUpForm, UserSignUpFormErrors } from '../../types';
import {
  validateEmail,
  validatePassword,
} from '../../utils';
import TextField from '@mui/material/TextField';

import './login.styles.scss';

const LoginComponent = () => {
    // states of form
    const [signUpForm, setSignUpForm] = useState<UserSignUpForm>({
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      username: '',
      dateOfBirth: new Date(),
      gender: 'prefer not to say',
    });
  
    const [signUpFormErrors, setSignUpFormErrors] =
      useState<UserSignUpFormErrors>({
        email: '',
        confirmEmail: '',
        password: '',
        confirmPassword: '',
        username: '',
      });
  
    // date validation
  
    // handlers
    const handleEmailChange = (email: string) => {
      setSignUpForm({ ...signUpForm, email: email });
      setSignUpFormErrors({ ...signUpFormErrors, email: validateEmail(email) });
    };

    const handlePasswordChange = (password: string) => {
      setSignUpForm({ ...signUpForm, password: password });
      setSignUpFormErrors({
        ...signUpFormErrors,
        password: validatePassword(password),
      });
    };

  return (
    <div className='log-in-component-wrapper'>
      <div className='log-in-title'>Welcome to music_app</div>
      <div className="log-in-component">
        <div className='log-in-value'>
          <div className='log-in-input-title'>Enter your email</div>
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
              error={signUpFormErrors.email ? true : false}
              label={`Enter your email`}
              value={signUpForm.email}
              onChange={(e) => handleEmailChange(e.target.value)}
              helperText={signUpFormErrors.email}
            ></TextField>
        </div>
        <div className='log-in-value'>
          <div className='log-in-password-title'>Enter a password</div>
          <TextField
              className="input-value"
              InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
              inputProps={{ style: { height: '15px' } }}
              error={signUpFormErrors.password ? true : false}
              label={'Enter your password'}
              type="password"
              value={signUpForm.password}
              onChange={(e) => handlePasswordChange(e.target.value)}
              helperText={signUpFormErrors.password}
            ></TextField>
        </div>
        <div className='log-in-link'>You don't have an account? <span className='link'>Sign In</span></div>
        <button className='log-in-button-sign-in'>Sign In</button>
      </div>
    </div>
  );
}

export default LoginComponent;