const Header = (props) => {
  return <h1>{props.course}</h1>
}

const Part = (props) => {
  return <p>{props.name} {props.exercises}</p>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((o, i) => <Part key={i} name={o.name} exercises={o.exercises} />)}
    </div>
  )
}

const Total = (props) => {
  return <p>Number of exercises {props.totalExercises}</p>
}

const App = () => {
  const course = 'Half Stack application development';

  const parts = [
    { name: "Fundamentals of React", exercises: 10 },
    { name: "Using props to pass data", exercises: 7 },
    { name: "State of a component", exercises: 14 },
  ];

  const totalExercises = parts.reduce((acc, o) => acc + o.exercises, 0);

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total totalExercises={totalExercises} />
    </div>
  )
}

export default App