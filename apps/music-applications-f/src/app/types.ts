export interface DropdownItem {
  type: string;
  label: string;
  spotify_id?: string;
}

export interface Neo4jDbItem {
  type: string;
  properties: any;
  relations: {
    type: string;
    target: {
      targetNode: string;
      properties: any;
    };
  }[];
}
