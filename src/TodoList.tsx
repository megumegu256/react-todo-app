import React from "react";
import { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void;
  deleteTodo: (id: string) => void;
};

const TodoList = (props: Props) => {
  const todos = props.todos;

  if (todos.length === 0) {
    return (
      <div className="text-red-500">
        現在、登録されているタスクはありません。
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="flex items-center justify-between rounded-md border p-0"
        >
          <div className="flex grow items-start">
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
              className="mr-1.5 cursor-pointer"
            />
            <div className="flex grow items-center">{todo.name}</div>

            <div className="flex grow items-center">
              優先度:{" "}
              {Array(todo.priority)
                .fill("💣")
                .map((bomb, index) => (
                  <span key={index}>{bomb}</span>
                ))}
            </div>

            <button
              onClick={() => props.deleteTodo(todo.id)}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              削除
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
