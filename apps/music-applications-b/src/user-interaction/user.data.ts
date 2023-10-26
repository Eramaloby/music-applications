import { Like } from '../likes/like.entity';

export interface UserInformation {
  username: string;
  imageBase64?: string;
  imageUrl?: string;
  likes: Like[];
  added: { type: string; name: string; nodeId: string }[];
  relationshipsCount: number;
  nodesCount: number;
  exists: boolean;
}
