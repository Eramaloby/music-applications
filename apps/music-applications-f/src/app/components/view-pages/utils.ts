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
  if (data.length > 0) {
    const type = data[0]._fields[0].labels[0];
    const properties = data[0]._fields[0].properties;

    const relations = [];

    for (const item of data) {
      const relation = item._fields[1];
      const targetNode = item._fields[2];

      relations.push({
        type: relation.type,
        target: {
          type: targetNode.labels[0],
          properties: targetNode.properties,
        },
      });
    }

    return { type, properties, relations };
  } else {
    return null;
  }
};

export const parseNeo4jRecords = (data: any) => {
  return data.records.map((value: any) => {
    const record = value._fields[0];
    return {
      type: [record.labels],
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
      total_tracks: track.album.total_tracks,
    },
  };
};

export const extractSpotifyArtistProperties = (track: any) => {
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
      total_tracks: track.album.total_tracks,
    },
  };
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
  };
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
    artist: album.artists.map((artist: any) => {
      return {
        label: artist.name,
        spotify_id: artist.id,
        type: artist.type,
      };
    }),
  };
};

const extractSpotifyObjProperties = (obj: any) => {
  // replace label within name?
  return {
    type: obj.type,
    spotify_id: obj.id,
    label: obj.name,
  };
};
