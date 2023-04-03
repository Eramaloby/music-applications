import { useState } from 'react';
import { UserSignUpForm, UserSignUpFormErrors } from '../../types';
import {
  validateEmail,
  validateEmailConfirm,
  validatePassword,
  validatePasswordConfirm,
  validateUsername,
} from '../../utils';
import { DatePickerValue } from '../../components/ui-elements/datepicker';
import dayjs, { Dayjs } from 'dayjs';

import './registration.styles.scss';

const RegistrationComponent = () => {
  // states of form
  const [signUpForm, setSignUpForm] = useState<UserSignUpForm>({
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    username: '',
    dateOfBirth: new Date(),
  });

  const [signUpFormErrors, setSignUpFormErrors] =
    useState<UserSignUpFormErrors>({
      email: '',
      confirmEmail: '',
      password: '',
      confirmPassword: '',
      username: '',
      dateOfBirth: '',
    });

  // date validation

  // handlers
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
    // setSignUpForm({ ...signUpForm, dateOfBirth: date });
  };

  return (
    <div className="registration-form-wrapper">
      <div className="form-wrapper">
        <div className="form-value">
          <input
            className="form-input"
            value={signUpForm.email}
            onChange={(e) => handleEmailChange(e.target.value)}
            spellCheck={false}
          ></input>
          <div className="value-tooltip">{signUpFormErrors.email}</div>
        </div>
        <div className="form-value">
          <input
            className="form-input"
            value={signUpForm.confirmEmail}
            onChange={(e) => handleEmailConfirmChange(e.target.value)}
            spellCheck={false}
          ></input>
          <div className="value-tooltip">{signUpFormErrors.confirmEmail}</div>
        </div>
        <div className="form-value">
          <input
            className="form-input"
            value={signUpForm.password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            spellCheck={false}
          ></input>
          <div className="value-tooltip">{signUpFormErrors.password}</div>
        </div>
        <div className="form-value">
          <input
            className="form-input"
            value={signUpForm.confirmPassword}
            onChange={(e) => handlePasswordConfirmChange(e.target.value)}
            spellCheck={false}
          ></input>
          <div className="value-tooltip">
            {signUpFormErrors.confirmPassword}
          </div>
        </div>
        <div className="form-value">
          <input
            className="form-input"
            value={signUpForm.username}
            onChange={(e) => handleUsernameChange(e.target.value)}
            spellCheck={false}
          ></input>
          <div className="value-tooltip">{signUpFormErrors.username}</div>
        </div>
        <div className="form-value">
          <div className="date-picker-wrapper">
            <DatePickerValue
              date={dayjs(signUpForm.dateOfBirth)}
              setDate={handleDateChange}
            ></DatePickerValue>
          </div>
        </div>
      </div>
      <div className="submit-btn-wrapper">
        <button type="button" className="submit-btn">
          Submit
        </button>
      </div>
    </div>
  );
};

export default RegistrationComponent;
