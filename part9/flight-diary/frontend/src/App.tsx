import { useEffect, useState } from "react";
import Diary from "./components/Diary";
import diaryService from "./services/diaries";
import { DiaryEntry } from "./types";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    const fetchDiaries = async () => {
      const data = await diaryService.getAll();
      setDiaries(data);
    };

    fetchDiaries();
  }, []);

  return (
    <div>
      <h2>Diary entries</h2>
      {diaries.map((d) => (
        <Diary key={d.id} diary={d} />
      ))}
    </div>
  );
};

export default App;
