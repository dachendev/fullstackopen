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

  const submitNewDiary = async (newDiary: NewDiaryEntry) => {
    console.log("add diary");

    try {
      const diary = await diaryService.create(newDiary);
      setDiaries(diaries.concat(diary));
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.data && typeof error.response.data === "string") {
          const message = error.response.data.replace(
            "Something went wrong. Error: ",
            ""
          );
          console.error(message);
          setError(message);
        }
      } else {
        console.error("unknown error", error);
        setError("unknown error");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <DiaryForm onSubmit={submitNewDiary} error={error} />
      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <Diary key={d.id} diary={d} />
      ))}
    </div>
  );
};

export default App;
