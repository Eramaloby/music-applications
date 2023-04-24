import axios from 'axios';
import { UserContext } from '../../../contexts/user.context';
import { ChangePasswordForm, ChangePasswordFormErrors } from '../../../types';
import {
  validatePassword,
  validatePasswordConfirm,
  tryToChangePassword,
} from '../../../utils';
import './change-password.styles.scss';

import React, { useContext, useEffect, useState } from 'react';

const ChangePasswordComponent = () => {
  const { currentUser } = useContext(UserContext);

  const [changePasswordForm, setChangePasswordForm] =
    useState<ChangePasswordForm>({
      confirmNewPassword: '',
      newPassword: '',
      currentPassword: '',
    });

  const [changePasswordFormErrors, setChangePasswordFormErrors] =
    useState<ChangePasswordFormErrors>({
      confirmNewPassword: '',
      newPassword: '',
      currentPassword: '',
    });

  // validation for current password
  useEffect(() => {
    const comparePasswordDelayTimer = setTimeout(() => {
      if (changePasswordForm.currentPassword !== '' && currentUser) {
        axios
          .get(`http://localhost:4200/api/password/compare`, {
            headers: { Authorization: `Bearer ${currentUser.accessToken}` },
            params: { password: changePasswordForm.currentPassword },
          })
          .then((response) => {
            if (!response.data) {
              setChangePasswordFormErrors({
                ...changePasswordFormErrors,
                currentPassword: 'Password is incorrect',
              });
            }
          });
      }
    }, 500);

    return () => clearTimeout(comparePasswordDelayTimer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePasswordForm.currentPassword]);

  // handlers
  const handleCurrentPasswordChange = (value: string) => {
    setChangePasswordForm({
      ...changePasswordForm,
      currentPassword: value,
    });

    setChangePasswordFormErrors({
      ...changePasswordFormErrors,
      currentPassword: value === '' ? 'Current password is required' : '',
    });

    // set up useEffect to fetch result from backend
  };

  const handleNewPasswordChange = (value: string) => {
    setChangePasswordForm({
      ...changePasswordForm,
      newPassword: value,
    });
    setChangePasswordFormErrors({
      ...changePasswordFormErrors,
      newPassword: validatePassword(value),
    });
  };

  const handleNewPasswordConfirmationChange = (value: string) => {
    setChangePasswordForm({
      ...changePasswordForm,
      confirmNewPassword: value,
    });
    setChangePasswordFormErrors({
      ...changePasswordFormErrors,
      confirmNewPassword: validatePasswordConfirm(
        value,
        changePasswordForm.newPassword
      ),
    });
  };

  const onBtnClick = async () => {
    const isValid = [
      changePasswordFormErrors.confirmNewPassword,
      changePasswordFormErrors.newPassword,
      changePasswordFormErrors.currentPassword,
    ].every((val: string) => val.length === 0);

    console.log(isValid);

    if (isValid && changePasswordForm.currentPassword && currentUser) {
      const response = await tryToChangePassword(
        changePasswordForm.currentPassword,
        changePasswordForm.newPassword,
        currentUser.accessToken
      );

      if (response) {
        setChangePasswordForm({
          newPassword: '',
          confirmNewPassword: '',
          currentPassword: '',
        });
      }

      // add some popup signaling that password is changed
    }
  };

  return (
    <div className="change-password-wrapper">
      <div className="inputs-wrapper">
        <div className="labelled-input-wrapper">
          <div className="input-label">Current password</div>
          <input
            className="change-password-input"
            type="password"
            placeholder="Type current password"
            value={changePasswordForm.currentPassword}
            onChange={(e) => handleCurrentPasswordChange(e.target.value)}
          ></input>
          <div className="change-password-tooltip">
            {changePasswordFormErrors.currentPassword}
          </div>
        </div>
        <div className="labelled-input-wrapper">
          <div className="input-label">New password</div>
          <input
            className="change-password-input"
            type="password"
            placeholder="Type in new password"
            value={changePasswordForm.newPassword}
            onChange={(e) => handleNewPasswordChange(e.target.value)}
          ></input>
          <div className="change-password-tooltip">
            {changePasswordFormErrors.newPassword}
          </div>
        </div>
        <div className="labelled-input-wrapper">
          <div className="input-label">Confirm new password</div>
          <input
            className="change-password-input"
            type="password"
            placeholder="Confirm new password"
            value={changePasswordForm.confirmNewPassword}
            onChange={(e) =>
              handleNewPasswordConfirmationChange(e.target.value)
            }
          ></input>
          <div className="change-password-tooltip">
            {changePasswordFormErrors.confirmNewPassword}
          </div>
        </div>
      </div>
      <div className="change-password-btn btn" onClick={() => onBtnClick()}>
        Change Password
      </div>
      {/* <div className="warning-text">
        Notice that you will be signed out after password change.
      </div> */}
    </div>
  );
};

export default ChangePasswordComponent;
