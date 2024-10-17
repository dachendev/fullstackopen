import axios from "axios";
import { DiaryEntry } from "../types";

const apiBaseUrl = "http://localhost:3000/api";

const getAll = async () => {
  const { data } = await axios.get<DiaryEntry[]>(`${apiBaseUrl}/diaries`);

  return data;
};

export default {
  getAll,
};
