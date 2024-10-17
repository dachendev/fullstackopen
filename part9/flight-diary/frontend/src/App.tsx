import axios from "axios";
import { useEffect, useState } from "react";
import Diary from "./components/Diary";
import DiaryForm from "./components/DiaryForm";
import diaryService from "./services/diaries";
import { DiaryEntry, NewDiaryEntry } from "./types";

const App = () => {
  const [error, setError] = useState<string | null>(null);
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const data = await diaryService.getAll();
      setDiaries(data);
    };

    fetchDiaries();
  }, []);

  const addDiary = async (diary: NewDiaryEntry): Promise<void> => {
    console.log("add diary");

    try {
      const addedDiary = await diaryService.create(diary);
      setDiaries(diaries.concat(addedDiary));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === "string") {
          const message = error.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          setError(message);
        }
      } else {
        setError("unknown error");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <DiaryForm addDiary={addDiary} error={error} />
      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <Diary key={d.id} diary={d} />
      ))}
    </div>
  );
};

export default App;
