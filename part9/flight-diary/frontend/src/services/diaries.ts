import axios from "axios";
import { DiaryEntry, NewDiaryEntry } from "../types";

const apiBaseUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000/api";

const getAll = async (): Promise<DiaryEntry[]> => {
  const { data } = await axios.get<DiaryEntry[]>(`${apiBaseUrl}/diaries`);
  return data;
};

const create = async (diary: NewDiaryEntry): Promise<DiaryEntry> => {
  const { data } = await axios.post<DiaryEntry>(`${apiBaseUrl}/diaries`, diary);
  return data;
};

export default {
  getAll,
  create,
};
