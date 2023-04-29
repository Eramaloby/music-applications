/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from 'axios';
import {
  Neo4jDbItem,
  SpotifyAlbum,
  SpotifyArtist,
  SpotifyTrack,
  SpotifyPlaylist,
  UserSignUpForm,
  UserSignInForm,
} from './types';

export const baseUrl = 'http://localhost:4200/api';

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
  // check bug when length is 0
  const type = data[0]._fields[0].labels[0];
  const name = data[0]._fields[0].properties.name;
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

  return { type, name, properties, relations } as unknown as Neo4jDbItem;
};

export const parseNeo4jRecords = (data: any) => {
  return data.records.map((value: any) => {
    const record = value._fields[0];
    return {
      type: record.labels.at(0),
      label: record.properties.name,
      spotify_id: record.properties.spotify_id,
    };
  });
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

// refactor functions below
export const extractSpotifyTrackProperties = (track: any) => {
  return {
    type: track.type,
    label: track.name,
    spotify_id: track.id,
    explicit: track.explicit,
    duration_ms: track.duration_ms,
    preview_url: track.preview_url,
    artists: track.artists.map((artist: any) => {
      return { label: artist.name, spotify_id: artist.id, type: artist.type };
    }),
    album: {
      spotify_id: track.album.id,
      type: track.album.type,
      images: track.album.images,
      label: track.album.name,
      album_type: track.album.album_type,
      release_date: track.album.release_date,
    },
  } as SpotifyTrack;
};

export const extractSpotifyArtistProperties = (artist: any): SpotifyArtist => {
  return {
    type: artist.type,
    label: artist.name,
    spotify_id: artist.id,
    preview_url: artist.preview_url,
    genres: artist.genres,
    images: artist.images,
  } as SpotifyArtist;
};

export const extractSpotifyPlaylistProperties = (playlist: any) => {
  return {
    spotify_id: playlist.id,
    description: playlist.description,
    owner_name: playlist.owner.display_name,
    images: playlist.images,
    name: playlist.name,
    collaborative: playlist.collaborative,
    type: playlist.type,
    tracks_num: playlist.tracks.total,
    tracks: playlist.tracks.items.slice(0, -1).map((value: any) => {
      return {
        type: value['track'].type,
        label: value['track'].name,
        spotify_id: value['track'].id,
        explicit: value['track'].explicit,
        duration_ms: value['track'].duration_ms,
        track_num: value['track'].track_number,
        artists: value['track'].artists.map((artist: any) => {
          return {
            label: artist.name,
            spotify_id: artist.id,
            type: artist.type,
          };
        }),
        album: {
          spotify_id: value['track'].album.id,
          type: value['track'].album.type,
          label: value['track'].album.name,
          album_type: value['track'].album.album_type,
        },
      };
    }),
  } as SpotifyPlaylist;
};

export const extractSpotifyAlbumProperties = (album: any) => {
  return {
    spotify_id: album.id,
    type: album.type,
    album_type: album.album_type,
    release_date: album.release_date,
    tracks_num: album.total_tracks,
    label: album.name,
    actual_label: album.label,
    images: album.images,
    tracks: album.tracks.items.map((track: any) => {
      return {
        type: track.type,
        label: track.name,
        spotify_id: track.id,
        explicit: track.explicit,
        duration_ms: track.duration_ms,
        track_num: track.track_number,
        artists: track.artists.map((artist: any) => {
          return {
            label: artist.name,
            spotify_id: artist.id,
            type: artist.type,
          };
        }),
      };
    }),
    artists: album.artists.map((artist: any) => {
      return {
        label: artist.name,
        spotify_id: artist.id,
        type: artist.type,
      };
    }),
  } as SpotifyAlbum;
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
  } else if (username.length < 4) {
    return 'Username must be longer than 4 symbols.';
  } else if (username.length > 20) {
    return 'Username must be shorter than 20 symbols.';
  }

  return '';
};

export const subtractYearsFromDate = (date: Date, years: number) => {
  date.setFullYear(date.getFullYear() - years);
  return date;
};

export const tryToSignIn = async (form: UserSignInForm) => {
  try {
    const response = await axios.post(`${baseUrl}/auth/signin`, {
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

export const tryToChangePassword = async (
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

export const tryToSignUp = async (form: UserSignUpForm) => {
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

  if (isFormValid) {
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
  } else {
    // show messages

    return false;
  }
};
