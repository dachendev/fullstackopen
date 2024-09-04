const Header = ({ text }) => {
  return <h1>{text}</h1>
}

const Part = ({ name, exercises }) => {
  return <p>{name} {exercises}</p>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(({ id, name, exercises }) => <Part key={id} name={name} exercises={exercises} />)}
    </div>
  )
}

const Total = (props) => {
  const totalExercises = props.course.parts.reduce((acc, o) => acc + o.exercises, 0);
  return <p>Number of exercises {totalExercises}</p>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
    </div>
  )
}

const App = () => {
  const course = {
    id: 1,
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10,
        id: 1
      },
      {
        name: 'Using props to pass data',
        exercises: 7,
        id: 2
      },
      {
        name: 'State of a component',
        exercises: 14,
        id: 3
      }
    ]
  }

  return <Course course={course} />
}

export default App