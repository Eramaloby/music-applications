import { useState } from 'react';
import { UserSignUpForm, UserSignUpFormErrors } from '../../types';
import {
  tryToSignUp,
  validateEmail,
  validateEmailConfirm,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from '../../utils';
import TextField from '@mui/material/TextField';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';

import './sign-up.styles.scss';
import { useNavigate } from 'react-router-dom';

const SignUpPage = () => {
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

  const router = useNavigate();

  const handleEmailChange = (email: string) => {
    setSignUpForm({ ...signUpForm, email: email });
    setSignUpFormErrors({ ...signUpFormErrors, email: validateEmail(email) });
  };

  const handleEmailConfirmChange = (emailConfirm: string) => {
    setSignUpForm({ ...signUpForm, confirmEmail: emailConfirm });
    setSignUpFormErrors({
      ...signUpFormErrors,
      confirmEmail: validateEmailConfirm(emailConfirm, signUpForm.email),
    });
  };

  const handlePasswordChange = (password: string) => {
    setSignUpForm({ ...signUpForm, password: password });
    setSignUpFormErrors({
      ...signUpFormErrors,
      password: validatePassword(password),
    });
  };

  const handlePasswordConfirmChange = (passwordConfirm: string) => {
    setSignUpForm({ ...signUpForm, confirmPassword: passwordConfirm });
    setSignUpFormErrors({
      ...signUpFormErrors,
      confirmPassword: validatePasswordConfirm(
        passwordConfirm,
        signUpForm.password
      ),
    });
  };

  const handleUsernameChange = (username: string) => {
    setSignUpForm({ ...signUpForm, username: username });
    setSignUpFormErrors({
      ...signUpFormErrors,
      username: validateUsername(username),
    });
  };

  const handleDateChange = (date: Dayjs | null) => {
    if (date) {
      setSignUpForm({ ...signUpForm, dateOfBirth: date.toDate() });
    }
  };

  const handleGenderChange = (value: string) => {
    setSignUpForm({ ...signUpForm, gender: value });
  };

  const onFormSubmit = async () => {
    const resultOfSignUp = await tryToSignUp(signUpForm);
    if (resultOfSignUp) {
      router('/signin');
    }
  };

  // form submitting

  return (
    <div className="registration-form-wrapper">
      <div className="registration-form-title">Sign up for more features</div>
      <div className="form-wrapper">
        <div className="form-value">
          <div className="form-value-label">What's your email?</div>
          <TextField
            className="form-value-input"
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
        <div className="form-value">
          <div className="form-value-label">Confirm your email</div>
          <TextField
            className="form-value-input"
            InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
            inputProps={{
              style: { color: 'white', fontWeight: '400', height: '15px' },
            }}
            error={signUpFormErrors.confirmEmail ? true : false}
            label={'Enter your email again'}
            value={signUpForm.confirmEmail}
            onChange={(e) => handleEmailConfirmChange(e.target.value)}
            helperText={signUpFormErrors.confirmEmail}
          ></TextField>
        </div>
        <div className="form-value">
          <div className="form-value-label">Create password</div>
          <TextField
            className="form-value-input"
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
        <div className="form-value">
          <div className="form-value-label">Confirm password</div>
          <TextField
            className="form-value-input"
            InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
            inputProps={{ style: { height: '15px' } }}
            error={signUpFormErrors.confirmPassword ? true : false}
            label={'Confirm your password'}
            type="password"
            value={signUpForm.confirmPassword}
            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
            helperText={signUpFormErrors.confirmPassword}
          ></TextField>
        </div>
        <div className="form-value">
          <div className="form-value-label">How should we call you?</div>
          <TextField
            className="form-value-input"
            InputLabelProps={{ style: { color: 'white', fontWeight: '500' } }}
            inputProps={{
              style: { color: 'white', fontWeight: '400', height: '15px' },
            }}
            error={signUpFormErrors.username ? true : false}
            label={'Enter a profile name'}
            value={signUpForm.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            helperText={signUpFormErrors.username}
          ></TextField>
          <div className="form-value-label-remark">
            This will appear on your profile
          </div>
        </div>
        <div className="form-value">
          <div className="form-value-label">What's your date of birth?</div>
          <div className="date-picker-wrapper form-value-input">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                views={['year', 'month', 'day']}
                value={dayjs(signUpForm.dateOfBirth)}
                onChange={(e) => handleDateChange(e)}
                slotProps={{
                  textField: {
                    InputLabelProps: {
                      style: { color: 'white', fontWeight: '500' },
                    },
                    InputProps: {
                      style: {
                        color: 'white',
                        fontWeight: '400',
                        width: '200px',
                      },
                    },
                  },
                  layout: {},
                }}
                disableFuture
              />
            </LocalizationProvider>
          </div>
        </div>
        <div className="form-value">
          <FormControl>
            <div className="form-value-label" id="radio-buttons-gender">
              What's your gender
            </div>
            <RadioGroup
              aria-labelledby="radio-buttons-gender"
              value={signUpForm.gender}
              onChange={(e) => handleGenderChange(e.target.value)}
              className="radio-group-wrapper form-value-input"
              row
            >
              <FormControlLabel
                value="female"
                control={<Radio />}
                label="Female"
              ></FormControlLabel>
              <FormControlLabel
                value="male"
                control={<Radio />}
                label="Male"
              ></FormControlLabel>
              <FormControlLabel
                value="prefer not to say"
                control={<Radio />}
                label="Prefer not to say"
              ></FormControlLabel>
            </RadioGroup>
          </FormControl>
        </div>
      </div>
      <div className="submit-btn-wrapper">
        <button type="button" className="submit-btn" onClick={onFormSubmit}>
          Sign up
        </button>
      </div>
      <div className="log-in-link-wrapper">
        <div className="log-in-link">
          Already have an account? {'\t'}
          <span className="link" onClick={() => router('/signin')}>
            Sign in
          </span>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
