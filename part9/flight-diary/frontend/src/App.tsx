import { useEffect, useState } from "react";
import Diary from "./components/Diary";
import diaryService from "./services/diaries";
import { DiaryEntry, NewDiaryEntry } from "./types";
import DiaryForm from "./components/DiaryForm";

const App = () => {
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
    const addedDiary = await diaryService.create(diary);
    setDiaries(diaries.concat(addedDiary));
  };

  return (
    <div>
      <h2>Add new entry</h2>
      <DiaryForm addDiary={addDiary} />
      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <Diary key={d.id} diary={d} />
      ))}
    </div>
  );
};

export default App;
