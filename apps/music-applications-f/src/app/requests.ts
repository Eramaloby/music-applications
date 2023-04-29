import axios from 'axios';
import {
  Neo4jDbItem,
  ProfilePageSavedStats,
  UserSignInForm,
  UserSignUpForm,
} from './types';
import { parseNeo4jData } from './utils';

export const baseUrl = 'http://localhost:4200/api';

export const fetchDatabaseItem = async (
  type: string,
  label: string
): Promise<Neo4jDbItem | null> => {
  try {
    const response = await axios.get(
      `${baseUrl}/node-relation/${type}/${label}`
    );

    return parseNeo4jData(response.data);
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const sendSignInRequest = async (form: UserSignInForm) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, {
      ...form,
    });

    if (response.status === 201) {
      return response.data;
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
  }
};

export const sendSignUpRequest = async (form: UserSignUpForm) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signup`, {
      username: form.username,
      password: form.password,
      email: form.email,
      dateOfBirth: form.dateOfBirth,
      gender: form.gender.toString(),
    });

    return response.statusText === 'Created';
  } catch (error) {
    console.log(error.response.data.message);

    return false;
  }
};

export const sendChangePasswordRequest = async (
  currentPassword: string,
  newPassword: string,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      `${baseUrl}/password/update`,
      { password: currentPassword, newPassword: newPassword },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.statusText === 'Created') {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchProfileStats = async (accessToken: string) => {
  try {
    const response = await axios.get(`${baseUrl}/profile/stats`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return {
      nodes: response.data[0],
      relationships: response.data[1],
    } as ProfilePageSavedStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const pressLike = async (nodeId: number, accessToken: string) => {
  try {
    await axios.post(
      `${baseUrl}/like/db`,
      { nodeId: nodeId },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};

export const dropLike = async (nodeId: number, accessToken: string) => {
  try {
    await axios.delete(`${baseUrl}/like/db`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { nodeId: nodeId },
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkIfLiked = async (nodeId: number, accessToken: string): Promise<boolean> => {
  try {
    const result = await axios.get(
      `${baseUrl}/like/db?nodeId=${nodeId}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return result.data;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const fetchUserProfileData = async (accessToken: string) => {
  try {
    const response = await axios.get(`http://localhost:4200/api/currentUser`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    return response.data;
  } catch(err) {
    console.log(err);
    return null;
  }
}
