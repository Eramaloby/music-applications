import { useNavigate } from 'react-router-dom';
import { ArtistTrackName } from './page-utils';
import { useState } from 'react';
import AppModal from '../../ui-elements/modal';
import axios from 'axios';
import { convertDuration, translateLyricsToVerses } from '../../../utils';
import { SpotifyTrack } from '../../../types';

const TrackInfo = ({ track }: { track: SpotifyTrack }) => {
  const [modal, setModal] = useState<boolean>(false);
  const [lyrics, setLyrics] = useState<string[]>([]);
  const router = useNavigate();
  const artistNameClickCallback = (spotify_id: string) =>
    router(`/artist/${spotify_id}`);

  const onMicrophoneClick = async () => {
    const wrapper = async () => {
      axios
        .get(`http://localhost:4200/api/lyrics/`, {
          params: { query: `${track.artists[0].label}-${track.label}` },
        })
        .then((response) => {
          // need to handle when there is no lyrics provided
          setLyrics(translateLyricsToVerses(response.data));
          setModal(true);
        });
    };

    await wrapper();
  };

  return (
    <div className="item-page-content">
      <div className="track-page-content-wrapper">
        <div className="track-album-image" onClick={() => onMicrophoneClick()}>
          <img
            src={track.album.images[1].url}
            height={300}
            width={300}
            alt="album-cover"
          ></img>
        </div>
        <div className="track-item-info">
          <div className="track-item-title-info">
            <div className="track-item-type-text">SONG</div>
            <div className="track-item-name">{track.label}</div>
          </div>
          <div
            className="track-item-lyrics"
            onClick={() => onMicrophoneClick()}
          >
            <img
              src="https://img.icons8.com/emoji/48/null/microphone-emoji.png"
              height={30}
              width={30}
              alt="mic"
            ></img>
          </div>
          <div className="track-item-additional-info">
            <audio
              controls
              // class="audio-1"
              className="track-preview-audio"
            >
              <source src={track.preview_url}></source>
            </audio>
            <div>Explicit: {track.explicit ? 'Explicit' : 'Not explicit'}</div>
            <div>
              Album:{' '}
              <span
                className="track-album-name"
                onClick={() => router(`/album/${track.album.spotify_id}`)}
              >
                {track.album.label}
              </span>
            </div>
          </div>
          <div className="track-item-footer">
            <div className="track-artistlist">
              {track.artists.map((artist, index) => (
                <ArtistTrackName
                  artist={artist}
                  onArtistClickCallback={artistNameClickCallback}
                  key={index}
                ></ArtistTrackName>
              ))}
            </div>
            <div className="symbol">&#9679;</div>
            <div>{track.album.release_date.slice(0, 4)}</div>
            <div className="symbol">&#9679;</div>
            <div>{convertDuration(track.duration_ms)}</div>
          </div>
        </div>
      </div>
      <AppModal visible={modal} setVisible={setModal} isHiddenOnClick={false}>
        {lyrics.length === 1 ? (
          <div style={{ textAlign: 'center' }}>{lyrics[0]}</div>
        ) : (
          <div className="track-lyrics">
            {lyrics.map((value, index) => (
              <div key={index} className="chunk-of-lyrics">
                {value}
              </div>
            ))}
          </div>
        )}
      </AppModal>
    </div>
  );
};

export default TrackInfo;
