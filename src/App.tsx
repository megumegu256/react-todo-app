import { useState } from "react";
import { Todo } from "./types";
import { initTodos } from "./initTodos";
//import WelcomeMessage from "./WelcomeMessage";
import TodoList from "./TodoList";
import { v4 as uuid } from "uuid";
import dayjs from "dayjs";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";

const App = () => {
  const [todos, setTodos] = useState<Todo[]>(initTodos);
  const [newTodoName, setNewTodoName] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState(3);
  const [newTodoDeadline, setNewTodoDeadline] = useState<Date | null>(null);
  const [newTodoNameError, setNewTodoNameError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [isAscendingByDeadline, setIsAscendingByDeadline] = useState(true);
  const [isAscendingByPriority, setIsAscendingBypriority] = useState(true);

  const updateIsDone = (id: string, value: boolean) => {
    const updatedTodos = todos.map((todo) => {
      if (todo.id === id) {
        return { ...todo, isDone: value };
      } else {
        return todo;
      }
    });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter((todo) => todo.id !== id);
    setTodos(updatedTodos);
  };

  const isValidTodoName = (name: string): string => {
    if (name.length < 2 || name.length > 32) {
      return "2文字以上、32文字以内で入力してください";
    } else {
      return "";
    }
  };

  const updateNewTodoName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoNameError(isValidTodoName(e.target.value));
    setNewTodoName(e.target.value);
  };

  const updateNewTodoPriority = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTodoPriority(Number(e.target.value));
  };

  const updateDeadline = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dt = e.target.value;
    console.log(`UI操作で日時が "${dt}" (${typeof dt}型) に変更されました。`);
    setNewTodoDeadline(dt === "" ? null : new Date(dt));
  };

  const addNewTodo = () => {
    const err = isValidTodoName(newTodoName);
    if (err !== "") {
      setNewTodoNameError(err);
      return;
    }
    const newTodo: Todo = {
      id: uuid(),
      name: newTodoName,
      isDone: false,
      priority: newTodoPriority,
      deadline: newTodoDeadline,
    };
    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    setNewTodoName("");
    setNewTodoPriority(3);
    setNewTodoDeadline(null);
    setShowSettings(false);
  };

  const handleConfirm = (message: string, onConfirm: () => void) => {
    setConfirmDialog({ message, onConfirm });
  };

  const handleConfirmClose = () => {
    setConfirmDialog(null);
  };

  const sortTodosByDeadline = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      if (a.deadline && b.deadline) {
        return isAscendingByDeadline
          ? new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
          : new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else if (a.deadline) {
        return isAscendingByDeadline ? -1 : 1;
      } else if (b.deadline) {
        return isAscendingByDeadline ? 1 : -1;
      } else {
        return 0;
      }
    });
    setTodos(sortedTodos);
    setIsAscendingByDeadline(!isAscendingByDeadline);
  };

  const sortTodosByPriority = () => {
    const sortedTodos = [...todos].sort((a, b) => {
      return isAscendingByPriority
        ? a.priority - b.priority
        : b.priority - a.priority;
    });
    setTodos(sortedTodos);
    setIsAscendingBypriority(!isAscendingByPriority);
  };

  return (
    <div className="mx-4 mt-10 max-w-2xl space-y-4 rounded-md border bg-cbgBlue p-1 md:mx-auto">
      <h1 className="mb-4 text-2xl font-bold">
        <span className="rounded-md border bg-gray-400 p-1">TodoApp</span>
      </h1>
      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={() => setShowSettings(!showSettings)}
          className="rounded-md border bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-600"
        >
          新しいタスクの追加
        </button>

        <button
          type="button"
          onClick={() =>
            handleConfirm("本当に完了済みタスクを削除しますか？", () => {
              const uncompletedTodos = todos.filter((todo) => !todo.isDone);
              setTodos(uncompletedTodos);
            })
          }
          className="rounded-md border bg-gray-500 px-3 py-1 font-bold text-white hover:bg-gray-600"
        >
          完了済みタスクを削除
        </button>

        <button
          type="button"
          onClick={() =>
            handleConfirm("本当に全てのタスクを削除しますか？", () => {
              setTodos([]);
            })
          }
          className="rounded-md border bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
        >
          全てのタスクを削除
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          type="button"
          onClick={sortTodosByDeadline}
          className="rounded-md border bg-green-500 px-3 py-1 font-bold text-white hover:bg-green-600"
        >
          期限でソート
        </button>

        <button
          type="button"
          onClick={sortTodosByPriority}
          className="rounded-md border bg-yellow-500 px-3 py-1 font-bold text-white hover:bg-yellow-600"
        >
          優先度でソート
        </button>
      </div>

      <TodoList
        todos={todos}
        updateIsDone={updateIsDone}
        deleteTodo={deleteTodo}
      />

      {showSettings && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="rounded-md border bg-gray-400 p-5 shadow-md">
            <div>
              <div className="flex items-center space-x-2">
                <label className="font-bold" htmlFor="newTodoName">
                  名前
                </label>
                <input
                  id="newTodoName"
                  type="text"
                  value={newTodoName}
                  onChange={updateNewTodoName}
                  className={twMerge(
                    "grow rounded-md border p-2",
                    newTodoNameError && "border-red-500 outline-red-500"
                  )}
                  placeholder="2文字以上、32文字以内で入力してください"
                />
              </div>
              {newTodoNameError && (
                <div className="ml-10 flex items-center space-x-1 text-sm font-bold text-red-500 ">
                  <FontAwesomeIcon
                    icon={faTriangleExclamation}
                    className="mr-0.5"
                  />
                  <div>{newTodoNameError}</div>
                </div>
              )}
            </div>

            <div className="flex gap-5">
              <div className="font-bold">優先度</div>
              {[1, 2, 3].map((value) => (
                <label key={value} className="flex items-center space-x-1">
                  <input
                    id={`priority-${value}`}
                    name="priorityGroup"
                    type="radio"
                    value={value}
                    checked={newTodoPriority === value}
                    onChange={updateNewTodoPriority}
                  />
                  <span>{value}</span>
                </label>
              ))}
            </div>

            <div className="flex items-center gap-x-2">
              <label htmlFor="deadline" className="font-bold">
                期限
              </label>
              <input
                type="datetime-local"
                id="deadline"
                value={
                  newTodoDeadline
                    ? dayjs(newTodoDeadline).format("YYYY-MM-DDTHH:mm:ss")
                    : ""
                }
                onChange={updateDeadline}
                className="rounded-md border border-gray-400 px-2 py-0.5"
              />
            </div>

            <button
              type="button"
              onClick={addNewTodo}
              className={twMerge(
                "border rounded-md bg-indigo-500 px-3 py-1 font-bold text-white hover:bg-indigo-600",
                newTodoNameError && "cursor-not-allowed opacity-50"
              )}
            >
              追加
            </button>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="rounded-md border bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
            >
              キャンセル
            </button>
          </div>
        </div>
      )}

      {confirmDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="rounded-md border-black  bg-white p-5 shadow-md">
            <p className="mb-4">{confirmDialog.message}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => {
                  confirmDialog.onConfirm();
                  handleConfirmClose();
                }}
                className="rounded-md border bg-red-500 px-3 py-1 font-bold text-white hover:bg-red-600"
              >
                はい
              </button>
              <button
                onClick={handleConfirmClose}
                className="rounded-md border bg-gray-500 px-3 py-1 font-bold text-white hover:bg-gray-600"
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
