import { ChangeEvent, SyntheticEvent, useState } from "react";
import { NewDiaryEntry, Visibility, Weather } from "../types";
import Alert from "./Alert";

interface DiaryFormProps {
  onSubmit: (diary: NewDiaryEntry) => void;
  error: string | null;
}

const visibilityOptions = Object.values(Visibility);
const weatherOptions = Object.values(Weather);

const DiaryForm = ({ onSubmit, error }: DiaryFormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState("");
  const [weather, setWeather] = useState("");
  const [comment, setComment] = useState("");

  const onVisibilityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const visibility = Object.values(Visibility).find(
        (v) => v.toString() === value
      );
      if (visibility) {
        setVisibility(visibility);
      }
    }
  };

  const onWeatherChange = (event: ChangeEvent<HTMLSelectElement>) => {
    event.preventDefault();
    if (typeof event.target.value === "string") {
      const value = event.target.value;
      const weather = Object.values(Weather).find(
        (w) => w.toString() === value
      );
      if (weather) {
        setWeather(weather);
      }
    }
  };

  const addDiary = (event: SyntheticEvent) => {
    event.preventDefault();

    if (!date || !visibility || !weather || !comment) {
      return;
    }

    onSubmit({
      date,
      visibility: visibility as Visibility,
      weather: weather as Weather,
      comment,
    });
  };

  return (
    <div>
      {error && <Alert color="error" text={error} />}
      <form onSubmit={addDiary}>
        <div>
          date
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div>
          visibility
          <select value={visibility} onChange={onVisibilityChange} required>
            <option value=""></option>
            {visibilityOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          weather
          <select value={weather} onChange={onWeatherChange} required>
            <option value=""></option>
            {weatherOptions.map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>
        <div>
          comment
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            required
          />
        </div>
        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
