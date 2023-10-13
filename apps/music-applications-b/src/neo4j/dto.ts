export class PostGenreDto {
  description: string;
  name: string;
  imageBase64?: string;
  imageUrl?: string;
}

export class PostArtistDto {
  name: string;
  type: string;
  spotifyId?: string;
  imageUrl?: string;
  imageBase64?: string;

  genres: PostGenreDto[];
}

export class PostPlaylistDto {
  // own properties
  name: string;
  description: string;
  ownerName: string;
  spotifyId?: string;
  collaborative?: string;
  imageUrl?: string;
  imageBase64?: string;

  // relations
  tracks: PostTrackDto[];
}

export class PostTrackDto {
  // own properties    
  name: string;
  durationMs: number;
  explicit: boolean;
  imageUrl?: string;
  imageBase64?: string;
  spotifyId?: string;

  // relations
  authorArtist: PostArtistDto;
  contributors: PostArtistDto[];
}

export class PostAlbumDto {
  // own properties
  name: string;
  type: string;
  countOfTracks: number;
  label: string;
  releaseDate: string;
  imageUrl?: string;
  imageBase64?: string;
  spotifyId?: string;

  // relations
  relatedGenres: PostGenreDto[];
  authorArtist: PostArtistDto;
  contributors: PostArtistDto[];
  tracks: PostTrackDto[];
}
