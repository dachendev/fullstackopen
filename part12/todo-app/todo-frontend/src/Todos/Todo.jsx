import PropTypes from "prop-types";

const Todo = ({ todo, deleteTodo, completeTodo }) => {
  const doneInfo = (
    <>
      <span>This todo is done</span>
      <span>
        <button onClick={deleteTodo}> Delete </button>
      </span>
    </>
  );

  const notDoneInfo = (
    <>
      <span>
        This todo is not done
      </span>
      <span>
        <button onClick={deleteTodo}> Delete </button>
        <button onClick={completeTodo}> Set as done </button>
      </span>
    </>
  );

  return (
    <div className="todo" style={{ display: 'flex', justifyContent: 'space-between', maxWidth: '70%', margin: 'auto' }}>
      <span>
        {todo.text} 
      </span>
      {todo.done ? doneInfo : notDoneInfo}
    </div>
  );
};

Todo.propTypes = {
  todo: PropTypes.object,
  deleteTodo: PropTypes.func,
  completeTodo: PropTypes.func,
};

export default Todo;