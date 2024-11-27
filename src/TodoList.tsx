import React from "react";
import { Todo } from "./types";

type Props = {
  todos: Todo[];
  updateIsDone: (id: string, value: boolean) => void; // ◀◀ 追加
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
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => props.updateIsDone(todo.id, e.target.checked)}
            className="mr-1.5 cursor-pointer"
          />
          {todo.name} 優先度: {todo.priority}
        </div>
      ))}
    </div>
  );
};

export default TodoList;
