import { useState } from 'react'

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>
}

const StatisticLine = ({text, value}) => {
  return <p>{text} {value}</p>
}

const Statistics = ({ good, neutral, bad }) => {
  const goodWeight = 1;
  const neutralWeight = 0;
  const badWeight = -1;

  const getAll = () => good + neutral + bad;
  const getWeightedAvg = () => (good * goodWeight + neutral * neutralWeight + bad * badWeight) / getAll();
  const getPositive = () => (good / getAll()) * 100;

  if (getAll() > 0) {
    return (
      <div>
        <h1>statistics</h1>
        <StatisticLine text="good" value={good} />
        <StatisticLine text="neutral" value={neutral} />
        <StatisticLine text="bad" value={bad} />
        <StatisticLine text="all" value={getAll()} />
        <StatisticLine text="average" value={getWeightedAvg()} />
        <StatisticLine text="positive" value={getPositive() + " %"} />
      </div>
    )
  }

  return (
    <div>
      <p>No feedback given</p>
    </div>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button text="good" handleClick={() => setGood(good + 1)} />
        <Button text="neutral" handleClick={() => setNeutral(neutral + 1)} />
        <Button text="bad" handleClick={() => setBad(bad + 1)} />
      </div>

      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App