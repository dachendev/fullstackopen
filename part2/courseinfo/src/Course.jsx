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

const Total = ({ parts }) => {
  const sum = parts.reduce((acc, part) => acc + part.exercises, 0);
  return <p><strong>total of {sum} exercises</strong></p>
}

const Course = ({ course }) => {
  return (
    <div>
      <Header text={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default Course;