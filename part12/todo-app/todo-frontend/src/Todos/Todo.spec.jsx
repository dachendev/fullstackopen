import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Todo from "./Todo";

describe("<Todo />", () => {
  const todo = {
    text: "Do something",
    done: false,
  };

  const renderTodo = (props = {}) => render(<Todo todo={todo} {...props} />);

  test("renders content", () => {
    const { container } = renderTodo();

    const div = container.querySelector(".todo");
    expect(div.textContent).toContain(todo.text);
  });

  test("handles delete button click", async () => {
    const onDeleteTodo = vi.fn();

    renderTodo({ deleteTodo: onDeleteTodo });

    const user = userEvent.setup();
    const delButton = screen.getByText("Delete");
    await user.click(delButton);

    expect(onDeleteTodo).toHaveBeenCalledTimes(1);
  });

  test("handles complete button click", async () => {
    const onCompleteTodo = vi.fn();

    renderTodo({ completeTodo: onCompleteTodo });

    const user = userEvent.setup();
    const doneButton = screen.getByText("Set as done");
    await user.click(doneButton);

    expect(onCompleteTodo).toHaveBeenCalledTimes(1);
  });
});
