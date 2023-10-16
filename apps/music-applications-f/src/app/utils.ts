/* eslint-disable @typescript-eslint/no-explicit-any */
import { Neo4jDbItem, UserSignUpForm, ItemPreview } from './types';
import { sendChangePasswordRequest, sendSignUpRequest } from './requests';

export const getBase64FromFile = (file: File) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const getDataURLtoFile = (dataUrl: string, filename: string): File => {
  const arr = dataUrl.split(',');
  const match = arr[0].match(/:(.*?);/);
  if (match && match[1]) {
    const mime = match[1] as string;
    const bstr = atob(arr[arr.length - 1]);
    const n = bstr.length;
    const u8arr = new Uint8Array(n);

    for (let i = 0; i < n; i++) {
      u8arr[i] = bstr.charCodeAt(i);
    }

    return new File([u8arr], filename, { type: mime });
  } else {
    throw new Error('Undefined mime type');
  }
};

export const convertDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Number.parseInt(((ms % 60000) / 1000).toFixed(0));
  return minutes + ':' + (seconds < 10 ? '0' : '') + seconds;
};

export const translateLyricsToVerses = (lyrics: string): string[] => {
  if (lyrics === 'Lyrics was not found') {
    return [lyrics];
  }

  const rawLyrics = lyrics
    .split(/\r?\n/)
    .filter((line) => (line ? true : false));

  const parsedChunks = [];
  let currentChunk = '';

  // looks really weird but still works
  // extract to other method
  for (const line of rawLyrics) {
    if (RegExp(/\[(.*?)\]/).test(line)) {
      if (!currentChunk) {
        currentChunk += `${line}\n`;
      } else {
        parsedChunks.push(currentChunk);
        currentChunk = `${line}\n`;
      }
    } else {
      currentChunk += `${line}\n`;
    }
  }

  return parsedChunks;
};

export const parseNeo4jData = (data: any[]) => {
  console.log(data);

  // check bug when length is 0
  const type = data[0]._fields[0].labels[0];
  const name = data[0]._fields[0].properties.name;
  const id = data[0]._fields[0].properties.id;
  const properties = data[0]._fields[0].properties;

  const relations = [];

  for (const item of data) {
    const relation = item._fields[1];
    const targetNode = item._fields[2];
    // refactor this to multiple.
    relations.push({
      type: relation.type,
      name: targetNode.properties.name,
      target: {
        type: targetNode.labels[0],
        properties: targetNode.properties,
      },
    });
  }

  return {
    type,
    name,
    id,
    properties,
    relations,
  } as unknown as Neo4jDbItem;
};

export const parseNeo4jRecords = (data: any) => {
  return data.records.map((value: any) => {
    const record = value._fields[0];
    return {
      type: record.labels.at(0),
      label: record.properties.name,
      spotify_id: record.properties.spotify_id,
      database_id: record.properties.id,
    };
  });
};

export const parseNeo4jRecommendation = (
  data: any,
  type: string
): ItemPreview => {
  return {
    databaseId: data.id,
    type: type,
    label: data.name,
  };
};

export const parseNeo4jLikes = (data: any): ItemPreview => {
  return {
    databaseId: data.properties.id,
    type: data.labels[0],
    label: data.properties.name,
  };
};

export const parseSpotifyData = (data: any) => {
  if (Object.keys(data).length > 1) {
    const parsedTracks = data.tracks.items.map((track: any) =>
      extractSpotifyObjProperties(track)
    );

    const parsedAlbums = data.albums.items.map((album: any) =>
      extractSpotifyObjProperties(album)
    );

    const parsedArtists = data.artists.items.map((artists: any) =>
      extractSpotifyObjProperties(artists)
    );

    const parsedPlaylists = data.playlists.items.map((playlist: any) =>
      extractSpotifyObjProperties(playlist)
    );

    const size = Math.min(
      parsedTracks.length,
      parsedAlbums.length,
      parsedArtists.length,
      parsedPlaylists.length
    );

    const results = [];
    for (let i = 0; i < size; i++) {
      results.push(
        parsedTracks[i],
        parsedAlbums[i],
        parsedPlaylists[i],
        parsedArtists[i]
      );
    }

    return results;
  }

  const [type] = Object.keys(data);
  switch (type) {
    case 'tracks':
      return data.tracks.items.map((track: any) =>
        extractSpotifyObjProperties(track)
      );
    case 'albums':
      return data.albums.items.map((album: any) =>
        extractSpotifyObjProperties(album)
      );
    case 'artists':
      return data.artists.items.map((artist: any) =>
        extractSpotifyObjProperties(artist)
      );
    case 'playlists':
      return data.playlists.items.map((playlist: any) =>
        extractSpotifyObjProperties(playlist)
      );
  }
};

const extractSpotifyObjProperties = (obj: any) => {
  // replace label within name?
  return {
    type: obj.type,
    spotify_id: obj.id,
    label: obj.name,
  };
};

export const emailExpression = new RegExp(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/);
export const usernameExpression = new RegExp(/^[a-zA-Z]+$/);
export const passwordExpression = new RegExp(
  /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/
);

// validators for forms
// refactor validation for email && confirm email fields
export const validateEmail = (email: string) => {
  if (!email.trim()) {
    return 'Email is required.';
  } else if (!emailExpression.test(email)) {
    return 'Given email address is not correct.';

    // put already in usage validation.
  }

  return '';
};

export const validateEmailConfirm = (emailConfirm: string, email: string) => {
  if (!emailConfirm.trim()) {
    return 'Confirming email address is required.';
  } else if (emailConfirm !== email) {
    return 'The email confirmation does not match.';
  } else if (
    !emailExpression.test(emailConfirm) ||
    !emailExpression.test(email)
  ) {
    return 'Given email address is not correct.';
  }

  return '';
};

export const validatePassword = (password: string) => {
  if (!password.trim()) {
    return 'Password is required.';
  } else if (password.length < 8) {
    return 'Password is too short.';
  } else if (password.length > 20) {
    return 'Password is too long.';
  } else if (!passwordExpression.test(password)) {
    return 'Password is too weak. Password at least must include: 1 upper case letter, 1 lower case letter, 1 digit or special character.';
  }

  return '';
};

export const validatePasswordConfirm = (
  passwordConfirm: string,
  password: string
) => {
  if (!passwordConfirm.trim()) {
    return 'Confirming password is required.';
  } else if (passwordConfirm !== password) {
    return 'The password confirmation does not match';
  } else if (password.length < 9 || passwordConfirm.length < 9) {
    return 'Password is too short. Use at least 9 characters.';
  }

  return '';
};

export const validateUsername = (username: string) => {
  if (!username.trim()) {
    return 'Username is required';
  } else if (username.includes(' ')) {
    return `Username can't contain whitespace`;
  } else if (username.length < 4) {
    return 'Username must be longer than 4 symbols';
  } else if (username.length > 20) {
    return 'Username must be shorter than 20 symbols';
  }

  return '';
};

export const subtractYearsFromDate = (date: Date, years: number) => {
  date.setFullYear(date.getFullYear() - years);
  return date;
};

export const validateFieldRequiredNotEmpty = (
  value: string,
  fieldName: string
) => {
  if (!value.trim()) {
    return `${fieldName} is required.`;
  }

  return '';
};

// export const tryToSignIn = async (form: UserSignInForm) => {
//   try {
//     const token: string = (await sendSignInRequest(form)).accessToken;
//     return token;
//   } catch (error) {
//     console.log(error);
//     return undefined;
//   }
// };

export const tryToChangePassword = async (
  currentPassword: string,
  newPassword: string,
  accessToken: string
) => {
  return await sendChangePasswordRequest(
    currentPassword,
    newPassword,
    accessToken
  );
};

export const tryToSignUp = async (form: UserSignUpForm) => {
  // add validation from server
  const formValidationMessages = [
    validateUsername(form.username),
    validateEmail(form.email),
    validateEmailConfirm(form.confirmEmail, form.email),
    validatePassword(form.password),
    validatePasswordConfirm(form.confirmPassword, form.password),
    // date of birth validation
  ];

  const isFormValid = formValidationMessages.every(
    (error: string) => error.length === 0
  );

  // add validation from server
  if (isFormValid) {
    return await sendSignUpRequest(form);
  } else {
    return false;
  }
};
