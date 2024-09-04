import { useState } from 'react'

const Button = ({ text, handleClick }) => <button onClick={handleClick}>{text}</button>;

const Daily = ({ anecdotes, points, setPoints }) => {
  const [selected, setSelected] = useState(0)

  const random = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const nextAnecdote = () => {
    const newSelected = random(0, anecdotes.length - 1);
    setSelected(newSelected);
  }

  const incrementPoints = () => {
    const newPoints = [...points];
    newPoints[selected]++;
    setPoints(newPoints);
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <p>{anecdotes[selected]}</p>
      <p>has {points[selected]} votes</p>
      <Button text="vote" handleClick={() => incrementPoints()} />
      <Button text="next anecdote" handleClick={() => nextAnecdote()} />
    </div>
  )
}

const MostVotes = ({ anecdotes, points }) => {
  const getMaxIndex = () => points.reduce((maxIndex, currValue, currIndex, arr) => (currValue > arr[maxIndex] ? currIndex : maxIndex), 0);

  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[getMaxIndex()]}</p>
      <p>has {points[getMaxIndex()]} votes</p>
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.',
    'The only way to go fast, is to go well.'
  ]

  const [points, setPoints] = useState(Array.from({ length: anecdotes.length }).fill(0))

  return (
    <>
      <Daily anecdotes={anecdotes} points={points} setPoints={setPoints} />
      <MostVotes anecdotes={anecdotes} points={points} />
    </>
  )
}

export default App