import React, { useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";

const DiaryForm = ({
  addDiary,
}: {
  addDiary: (diary: NewDiaryEntry) => void;
}) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const onSubmit = (event: React.SyntheticEvent): void => {
    event.preventDefault();

    const newDiary: NewDiaryEntry = {
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    };

    addDiary(newDiary);
  };

  return (
    <form onSubmit={onSubmit}>
      <div>
        date
        <input
          type="text"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div>
        visibility
        <input
          type="text"
          value={visibility}
          onChange={(e) => setVisibility(e.target.value)}
        />
      </div>
      <div>
        weather
        <input
          type="text"
          value={weather}
          onChange={(e) => setWeather(e.target.value)}
        />
      </div>
      <div>
        comment
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>
      <button>add</button>
    </form>
  );
};

export default DiaryForm;
