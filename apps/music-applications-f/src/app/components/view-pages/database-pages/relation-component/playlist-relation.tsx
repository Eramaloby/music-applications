// import { useNavigate } from 'react-router-dom';
// import { Neo4jDbItem, PlaylistProperties } from '../../../../types';
// import ToRelation from './to-relation';

// const PlaylistRelation = ({
//   item,
//   routingCallback,
// }: {
//   item: Neo4jDbItem;
//   routingCallback: (type: string, id: number) => void;
// }) => {
//   const router = useNavigate();

//   const containsToTrackRelations = item.relations.filter(
//     (relation: { type: string; target: Neo4jDbItem }) =>
//       relation.type === 'Contains' && relation.target.type === 'Track'
//   );
//   const containsToAlbumRelations = item.relations.filter(
//     (relation: { type: string; target: Neo4jDbItem }) =>
//       relation.type === 'Contains' && relation.target.type === 'Album'
//   );

//   return (
//     <div className="database-item-page-text">
//       <div className="database-item-name-author-text">
//         <div className="database-item-name-text">{item.name.toUpperCase()}</div>
//         <div className="database-item-text">
//           <div>
//             <div className="database-item-by">Added by: </div>
//             <div onClick={() => router(`/profile/${item.properties.added_by}`)}>
//               {item.properties.added_by}
//             </div>
//           </div>

//           {item.type === 'Playlist' ? (
//             <div className="database-item-author-description-text">
//               <div className="database-item-by">Owner-name:</div>
//               {(item.properties as PlaylistProperties).owner_name}
//             </div>
//           ) : (
//             <div></div>
//           )}
//         </div>
//       </div>
//       <div className="database-item-description-text">
//         <div className="database-item-contains-totrack-text">
//           {containsToTrackRelations.length > 0 ? (
//             <div>
//               <div className="database-item-contains-head-text">Tracks</div>
//               <div className="database-item-scroll">
//                 {containsToTrackRelations.map(
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
//             </div>
//           ) : (
//             <div></div>
//           )}
//         </div>
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
//       </div>
//     </div>
//   );
// };

// export default PlaylistRelation;
