import { useState } from "react";
import useSWR, { mutate } from "swr";
import useSWRMutation from "swr/mutation";
import AddTodos from "./components/todos/addTodo";
import EditTodo from "./components/todos/editTodo";
import { useFetch, BASE_URL } from "./hooks/useFetch";

const Todos = () => {
  const { getMehtod, otherMethod } = useFetch();
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState({});

  // Main todos fetch
  const {
    data: allTodos,
    error,
    isLoading,
  } = useSWR(`${BASE_URL}todos`, () => getMehtod("todos"));

  / * <---------------- add method start------------------------------->  */;
  
  const handleAddTodoTrigger = async (url, { arg }) => {
    const result = await otherMethod("todos", "POST", arg);
    return result;
  };
  const handleAddSuccess = (result) => {
    const updatedTodos = [...(allTodos || []), result];
    mutate(`${BASE_URL}todos`, updatedTodos, false);
  };

  const { trigger: addTodoTrigger } = useSWRMutation(
    `${BASE_URL}todos`,
    handleAddTodoTrigger,
    {
      onSuccess: (result) => handleAddSuccess(result),
    }
  );
  / * <---------------- add method end ------------------------------->  */;

  / * <---------------- edit method start ---------------------------->*/;

  const handleEditTodoTrigger = async (url, { arg }) => {
    const { key, updatedTodo } = arg;
    const result = await otherMethod(`todos/${key}`, "PUT", updatedTodo);
    return result;
  };

  const handleEditSuccess = (result) => {
    const updatedTodos = allTodos.map((todo) =>
      todo.id === result.id ? result : todo
    );
    mutate(`${BASE_URL}todos`, updatedTodos, false);
  };

  const { trigger: editTodoTrigger } = useSWRMutation(
    `${BASE_URL}todos/1`,
    handleEditTodoTrigger,
    {
      onSuccess: (result) => handleEditSuccess(result),
    }
  );

  / * <---------------- edit method end -------------------------------->*/;

  / * <---------------- delete method start ---------------------------->*/;
  const handleDeleteTodoTrigger = async (url, { arg }) => {
    const obj = {};

    const result = await otherMethod(`todos/${arg}`, "DELETE", obj);
    return result;
  };

  const handleDeleteSuccess = (result) => {
    const updatedTodos = allTodos.filter((todo) => todo.id !== result.id);
    mutate(`${BASE_URL}todos`, updatedTodos, false);
  };

  const { trigger: deleteTodoTrigger } = useSWRMutation(
    `${BASE_URL}todos`,
    handleDeleteTodoTrigger,
    {
      onSuccess: (result) => handleDeleteSuccess(result),
    }
  );

  / * <---------------- delete method end ------------------------------>*/;

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = async () => {
    if (!inputValue.trim()) return;

    const newTodo = {
      id: allTodos ? allTodos.length + 1 : 1,
      title: inputValue.trim(),
      completed: false,
    };

    try {
      await addTodoTrigger(newTodo);
      setInputValue("");
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleToggle = async (key, todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    try {
      await editTodoTrigger({ key, updatedTodo });
    } catch (error) {
      console.error("Failed to toggle todo:", error);
    }
  };

  const handleEdit = (key, todo) => {
    setEditTodo({ ...todo });
    setIsModalOpen(true);
  };

  const handleEditSubmit = async (todo) => {
    try {
      await editTodoTrigger({ key: todo.id, updatedTodo: todo });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to edit todo:", error);
    }
  };

  const handleDelete = async (key) => {
    try {
      await deleteTodoTrigger(key);
    } catch (error) {
      console.error("Failed to delete todo:", error);
    }
  };

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading todos: {error.message}
      </div>
    );
  }

  if (isLoading) {
    return <div className="p-4">Loading todos...</div>;
  }

  return (
    <>
      <section className="w-full max-w-2xl mx-auto p-4">
        <AddTodos
          value={inputValue}
          onInputchange={handleInputChange}
          onAddTodo={handleAddTodo}
        />

        {allTodos && allTodos.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No todos yet. Add one to get started!
          </p>
        )}

        <div className="space-y-2 mt-4">
          {allTodos?.map((individualTodo) => (
            <div
              key={individualTodo.id}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex-1 flex items-center gap-x-3">
                <span className="text-gray-500 text-sm">
                  #{individualTodo.id}
                </span>
                <p
                  className={`truncate ${
                    individualTodo.completed ? "line-through text-gray-500" : ""
                  }`}
                >
                  {individualTodo.title}
                </p>
              </div>
              <div className="flex gap-x-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${
                      individualTodo.completed
                        ? "bg-green-100 text-green-700 hover:bg-green-200"
                        : "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                    }`}
                  onClick={() =>
                    handleToggle(individualTodo.id, individualTodo)
                  }
                >
                  {individualTodo.completed ? "Done" : "Pending"}
                </button>
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  onClick={() => handleEdit(individualTodo.id, individualTodo)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  onClick={() => handleDelete(individualTodo.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <EditTodo
        todo={editTodo}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onEdit={handleEditSubmit}
      />
    </>
  );
};

export default Todos;
