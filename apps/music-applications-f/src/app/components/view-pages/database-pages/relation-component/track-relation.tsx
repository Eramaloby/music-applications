// import { useNavigate } from 'react-router-dom';
// import { Neo4jDbItem, TrackProperties } from '../../../../types';
// import ToRelation from './to-relation';

// const TrackRelation = ({
//   item,
//   routingCallback,
// }: {
//   item: Neo4jDbItem;
//   routingCallback: (type: string, id: number) => void;
// }) => {
//   const router = useNavigate();

//   const containsToAlbumRelations = item.relations.filter(
//     (relation: { type: string; target: Neo4jDbItem }) =>
//       relation.type === 'Contains' && relation.target.type === 'Album'
//   );
//   const containsToPlaylistRelations = item.relations.filter(
//     (relation: { type: string; target: Neo4jDbItem }) =>
//       relation.type === 'Contains' && relation.target.type === 'Playlist'
//   );
//   const authorToArtistRelations = item.relations.filter(
//     (relation: { type: string; target: Neo4jDbItem }) =>
//       relation.type === 'Author' && relation.target.type === 'Artist'
//   );

//   return (
//     <div className="database-item-page-text">
//       <div className="database-item-name-author-text">
//         <div className="database-item-name-text">{item.name.toUpperCase()}</div>
//         <div>
//           {authorToArtistRelations.length > 0 ? (
//             <div className="database-item-author-toartist-relation">
//               <div className="database-item-author-text">
//                 <div className="database-item-by">By</div>
//                 {authorToArtistRelations.map(
//                   (
//                     relation: { type: string; target: Neo4jDbItem },
//                     index: number
//                   ) => {
//                     return (
//                       <ToRelation
//                         routingCallback={routingCallback}
//                         target={relation.target}
//                         key={index}
//                       ></ToRelation>
//                     );
//                   }
//                 )}
//               </div>
//               <div className="database-item-by">Added by: </div>
//               <div
//                 onClick={() => router(`/profile/${item.properties.added_by}`)}
//               >
//                 {item.properties.added_by}
//               </div>
//               <div>
//                 {(item.properties as TrackProperties).explicit ? (
//                   <div className="database-item-author-description-text">
//                     <div className="database-item-explicit">Explicit:</div>{' '}
//                     {(item.properties as TrackProperties).explicit ? (
//                       <div>Yes</div>
//                     ) : (
//                       <div>No</div>
//                     )}
//                   </div>
//                 ) : (
//                   <div></div>
//                 )}
//               </div>
//             </div>
//           ) : (
//             <div></div>
//           )}
//         </div>
//       </div>
//       <div className="database-item-description-text">
//         <div className="database-item-contains-toalbum-text">
//           {containsToAlbumRelations.length > 0 ? (
//             <div>
//               <div className="database-item-contains-head-text">Albums</div>
//               {containsToAlbumRelations.map(
//                 (
//                   relation: { type: string; target: Neo4jDbItem },
//                   index: number
//                 ) => {
//                   return (
//                     <ToRelation
//                       routingCallback={routingCallback}
//                       target={relation.target}
//                       key={index}
//                     ></ToRelation>
//                   );
//                 }
//               )}
//             </div>
//           ) : (
//             <div></div>
//           )}
//         </div>
//         <div className="database-item-contains-toplaylist-text">
//           {containsToPlaylistRelations.length > 0 ? (
//             <div className="database-item-scroll">
//               <div className="database-item-contains-head-text">Playlists</div>
//               {containsToPlaylistRelations.map(
//                 (
//                   relation: { type: string; target: Neo4jDbItem },
//                   index: number
//                 ) => {
//                   return (
//                     <ToRelation
//                       routingCallback={routingCallback}
//                       target={relation.target}
//                       key={index}
//                     ></ToRelation>
//                   );
//                 }
//               )}
//             </div>
//           ) : (
//             <div></div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TrackRelation;
