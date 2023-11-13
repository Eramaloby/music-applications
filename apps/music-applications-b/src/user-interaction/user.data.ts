import { DatabaseItemPreview } from "../neo4j/types";

export interface UserInformation {
  username: string;
  imageBase64: string;
  likes: DatabaseItemPreview[];
  added: DatabaseItemPreview[];
  relationshipsCount: number;
  nodesCount: number;
  exists: boolean;
  subscribers: string;
  subscriptions: string;
}
