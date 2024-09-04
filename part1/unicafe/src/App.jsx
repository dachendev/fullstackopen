import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const goodWeight = 1;
  const neutralWeight = 0;
  const badWeight = -1;

  const getCount = () => good + neutral + bad;
  const getAverage = () => (good * goodWeight + neutral * neutralWeight + bad * badWeight) / getCount();
  const getPositive = () => (good / getCount()) * 100;

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text="good" handleClick={() => setGood(good + 1)} />
        <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
        <Button text="bad" handleClick={() => setBad(bad + 1)} />
      </div>
      <h1>statistics</h1>
      <div>
        <p>good {good}</p>
        <p>neutral {neutral}</p>
        <p>bad {bad}</p>
        <p>all {getCount()}</p>
        <p>average {getAverage()}</p>
        <p>positive {getPositive()} %</p>
      </div>
    </div>
  )
}

export default App