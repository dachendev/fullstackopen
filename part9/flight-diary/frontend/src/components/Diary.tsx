import { DiaryEntry } from "../types";

const Diary = ({ diary }: { diary: DiaryEntry }) => {
  return (
    <div>
      <h3>{diary.date}</h3>
      <div>visibility: {diary.visibility}</div>
      <div>weather: {diary.weather}</div>
    </div>
  );
};

export default Diary;
