import axios from "axios";
import { Neo4jDbItem } from "./types";
import { baseUrl, parseNeo4jData } from "./utils";

export const fetchDatabaseItem = async (
  type: string,
  label: string
): Promise<Neo4jDbItem | null> => {
  try {
    const response = await axios.get(
      `${baseUrl}/node-relation/${type}/${label}`
    );

    return parseNeo4jData(response.data);
  } catch (error) {
    console.log(error);

    return null;
  }
};
