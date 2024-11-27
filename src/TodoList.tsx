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
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className="relative flex max-w-md items-center justify-between rounded-md border bg-white p-1"
        >
          <div className="flex grow items-start">
            <input
              type="checkbox"
              checked={todo.isDone}
              onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
              className="mr-1.5 cursor-pointer"
            />
            <div className="flex grow items-center">{todo.name}</div>

            <div>
              優先度:{" "}
              {Array(todo.priority)
                .fill("💣")
                .map((bomb, index) => (
                  <span key={index}>{bomb}</span>
                ))}
            </div>

            <div>
              期限:{" "}
              {todo.deadline
                ? new Date(todo.deadline).toLocaleString()
                : "未設定"}
            </div>

            <div className="flex grow items-end">
              <button
                onClick={() => props.deleteTodo(todo.id)}
                className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-red-500 text-white hover:bg-red-600"
              >
                ✖
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TodoList;
