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

/* NEO4J DB REQUESTS */
export const fetchDatabaseItem = async (
  id: number,
  type: string
): Promise<Neo4jDbItem | null> => {
  try {
    const response = await axios.get(`${baseUrl}/neo4j/${type}/${id}`);

    return parseNeo4jData(response.data);
  } catch (error) {
    console.log(error);

    return null;
  }
};

export const fetchDatabaseStats = async () => {
  try {
    const response = await axios.get(`${baseUrl}/neo4j/db-stats`);
    return {
      nodes: response.data[0],
      relationships: response.data[1],
    } as DbStats;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export interface PostItemResponse {
  isSuccess: boolean;
  message?: string;
  records: { name: string; type: string }[];
  relsCount: number;
}

export const postItemFromParameters = async (accessToken: string, dto: any) => {
  try {
    const response = await axios.post(`${baseUrl}/neo4j/genre`, dto, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  } catch (error) {
    console.log(error);
  }
};

export const postItemToNeo4j = async (
  itemType: string,
  spotify_id: string,
  accessToken: string
): Promise<PostItemResponse> => {
  try {
    const response = await axios.post(
      `${baseUrl}/neo4j/${itemType}/${spotify_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (response.data.isSuccess) {
      return {
        isSuccess: true,
        records: [...response.data.data.records],
        relsCount: response.data.data.relationshipCount,
      };
    } else {
      return {
        isSuccess: false,
        records: [],
        message: response.data.reason,
        relsCount: 0,
      };
    }
  } catch (error) {
    return {
      isSuccess: false,
      message: error.message,
      records: [],
      relsCount: 0,
    };
  }
};

// TODO BACKEND: move controller to separate module(Profile module) and refactor
export const isItemInDatabase = async (id: string): Promise<boolean | null> => {
  try {
    const response = await axios.get(`${baseUrl}/neo4j/${id}`);
    return response.data;
  } catch (err) {
    console.log(err, 'error in request');
    return null;
  }
};

/* AUTH REQUESTS */
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

/* USER PROFILE REQUESTS */
export const updateProfileImage = async (
  accessToken: string,
  pictureBase64: string
) => {
  try {
    await axios.post(
      `${baseUrl}/profile/picture`,
      { pictureBase64 },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return true;
  } catch (error) {
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

    console.log(response, 'fetched-stats');

    return {
      nodes: response.data.nodesCount,
      relationships: response.data.relationshipCount,
    } as DbStats;
  } catch (error) {
    console.log(error);
    return null;
  }
};

/* PASSWORD REQUESTS */
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

/* LIKE MODULE REQUESTS */
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

    // TODO FRONTEND REFACTORING: review all parsing strategies
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

// Currently controller in app module, but could be moved to different instance
export const fetchUserProfileData = async (token: string) => {
  try {
    const response = await axios.get(`${baseUrl}/currentUser`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (err) {
    return null;
  }
};

/* SPOTIFY MODULE REQUESTS */
export const getSpotifyItem = async (
  type: string,
  id: string
): Promise<GetSpotifyItemResponse> => {
  try {
    const response = await axios.get(`${baseUrl}/spotify/${type}/${id}`);
    return { item: response.data, statusCode: 200 };
  } catch (err) {
    return { item: null, statusCode: err.response.status };
  }
};

export interface GetUserInformationResponse {
  username: string;
  imageBase64?: string;
  imageUrl?: string;
  // add likes module
  added: { type: string; name: string; nodeId: number }[];
  relationshipsCount: number;
  nodesCount: number;

  exists: boolean;
}

/* USER INTERACTIONS REQUESTS */
export const getUserInformation = async (
  username: string
): Promise<GetUserInformationResponse> => {
  try {
    const response = await axios.get(
      `${baseUrl}/interactions/user/${username}`
    );

    console.log(response.data, 'response');
    return response.data;
  } catch (error) {
    return {
      username: username,
      exists: false,
      added: [],
      relationshipsCount: 0,
      nodesCount: 0,
    };
  }
};

export interface GetSpotifyItemResponse {
  item: any;
  statusCode: number;
}
