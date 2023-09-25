import axios from 'axios';
import {
  Neo4jDbItem,
  DbStats,
  UserSignInForm,
  UserSignUpForm,
  ItemPreview,
  UserSignInRequestResult,
} from './types';
import {
  parseNeo4jData,
  parseNeo4jLikes,
  parseNeo4jRecommendation,
} from './utils';

export const baseUrl = 'http://localhost:4200/api';

export const fetchDatabaseItem = async (
  id: number,
  type: string
): Promise<Neo4jDbItem | null> => {
  try {
    const response = await axios.get(`${baseUrl}/item/db/${type}/${id}`);

    return parseNeo4jData(response.data);
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const sendSignInRequest = async (
  form: UserSignInForm
): Promise<UserSignInRequestResult> => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, {
      ...form,
    });

    // undefined is required to point out
    // little trick with access token avoiding object wrapping?
    return {
      isSuccessful: true,
      token: response.data.accessToken,
      reason: undefined,
    };
  } catch (err) {
    return {
      isSuccessful: false,
      token: undefined,
      reason: err.response.data.message,
    };
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
    } as DbStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const pressLikeSpotifyId = async (
  spotify_id: string,
  accessToken: string
) => {
  try {
    await axios.post(
      `${baseUrl}/like`,
      { spotify_id: spotify_id },
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

export const dropLikeSpotifyId = async (
  spotify_id: string,
  accessToken: string
) => {
  try {
    await axios.delete(`${baseUrl}/like`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: { spotify_id: spotify_id },
    });
  } catch (err) {
    console.log(err);
  }
};

export const checkIfLiked = async (
  nodeId: number,
  accessToken: string
): Promise<boolean> => {
  try {
    const result = await axios.get(`${baseUrl}/like/db?nodeId=${nodeId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result.data;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const checkIfLikedSpotifyId = async (
  spotify_id: string,
  accessToken: string
): Promise<boolean> => {
  try {
    const result = await axios.get(`${baseUrl}/like?spotifyId=${spotify_id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return result.data;
  } catch (err) {
    console.log(err);
    return false;
  }
};

export const getAllUserLikes = async (
  token: string
): Promise<ItemPreview[] | undefined> => {
  try {
    const result = await axios.get(`${baseUrl}/like/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const parsed = result.data.map((value: any) => parseNeo4jLikes(value));

    return parsed;
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const receiveRecommendations = async (
  token: string
): Promise<ItemPreview[] | undefined> => {
  try {
    const result = await axios.get(`${baseUrl}/like/recommendations`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const [albums, genres, artists, tracks] = [
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.data.albums.map((obj: any) =>
        parseNeo4jRecommendation(obj, 'Album')
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.data.genres.map((obj: any) =>
        parseNeo4jRecommendation(obj, 'Genre')
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.data.artists.map((obj: any) =>
        parseNeo4jRecommendation(obj, 'Artist')
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      result.data.tracks.map((obj: any) =>
        parseNeo4jRecommendation(obj, 'Track')
      ),
    ];
    return [...albums, ...genres, ...artists, ...tracks] as ItemPreview[];
  } catch (err) {
    console.log(err);
    return undefined;
  }
};

export const fetchUserProfileData = async (token: string) => {
  try {
    console.log(baseUrl, 'base url', token, 'token');
    const response = await axios.get(`${baseUrl}/currentUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    return null;
  }
};

export const fetchDatabaseStats = async () => {
  try {
    const response = await axios.get(`${baseUrl}/db-stats`);
    return {
      nodes: response.data[0],
      relationships: response.data[1],
    } as DbStats;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getSpotifyItem = async (type: string, id: string) => {
  try {
    const response = await axios.get(`${baseUrl}/item/${type}/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const isItemInDatabase = async (id: string): Promise<boolean | null> => {
  try {
    const response = await axios.get(`${baseUrl}/exists/${id}`);
    return response.data;
  } catch (err) {
    console.log(err);
    return null;
  }
};
