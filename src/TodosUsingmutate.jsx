import { useState } from "react";
import useSWR, { mutate } from "swr";
import AddTodos from "./components/todos/addTodo";
import EditTodo from "./components/todos/editTodo";
import { useFetch, BASE_URL } from "./hooks/useFetch";

const Todos = () => {
  const { getMehtod, otherMethod } = useFetch();
  const [inputValue, setInputValue] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState({});

  const getFetcher = () => getMehtod("todos");

  // SWR hook for fetching todos
  const { data: allTodos, error, isLoading } = useSWR(`${BASE_URL}todos`, getFetcher, {
    revalidateOnFocus: true,
    revalidateOnReconnect: true
  });

  const addNewTodo = async (obj) => {
    try {
      await otherMethod(`todos`, "POST", obj);
      mutate(`${BASE_URL}todos`);
    } catch (err) {
      console.error("Failed to add todo:", err);
    }
  };

  const editExistingTodo = async (key, obj) => {
    try {
      await otherMethod(`todos/${key}`, "PUT", obj);
      mutate(`${BASE_URL}todos`);
    } catch (err) {
      console.error("Failed to edit todo:", err);
    }
  };

  const deleteTodo = async (key) => {
    try {
      await otherMethod(`todos/${key}`, "DELETE", {});
      // Revalidate the todos list after deleting
      mutate(`${BASE_URL}todos`);
    } catch (err) {
      console.error("Failed to delete todo:", err);
    }
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleAddTodo = () => {
    if (!inputValue.trim()) return;

    const obj = {
      id: allTodos ? allTodos.length + 1 : 1,
      title: inputValue.trim(),
      completed: false,
    };
    addNewTodo(obj);
    setInputValue(""); // Clear input after adding
  };

  const handleToggle = (key, todo) => {
    const updatedTodo = { ...todo, completed: !todo.completed };
    editExistingTodo(key, updatedTodo);
  };

  const handleEdit = (key, todo) => {
    setEditTodo({ ...todo });
    setIsModalOpen(true);
  };

  const handleEditSubmit = (todo) => {
    editExistingTodo(todo.id, todo);
    setIsModalOpen(false);
  };

  if (error) {
    return <div className="text-red-500 p-4">Error loading todos: {error.message}</div>;
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
          <p className="text-gray-500 text-center py-4">No todos yet. Add one to get started!</p>
        )}

        <div className="space-y-2 mt-4">
          {allTodos?.map((individualTodo) => (
            <div
              key={individualTodo.id}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm border border-gray-200"
            >
              <div className="flex-1 flex items-center gap-x-3">
                <span className="text-gray-500 text-sm">#{individualTodo.id}</span>
                <p className={`truncate ${individualTodo.completed ? 'line-through text-gray-500' : ''}`}>
                  {individualTodo.title}
                </p>
              </div>
              <div className="flex gap-x-2">
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
                    ${individualTodo.completed
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                    }`}
                  onClick={() => handleToggle(individualTodo.id, individualTodo)}
                >
                  {individualTodo.completed ? 'Done' : 'Pending'}
                </button>
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium bg-blue-100 text-blue-700 hover:bg-blue-200 transition-colors"
                  onClick={() => handleEdit(individualTodo.id, individualTodo)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 rounded-md text-sm font-medium bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
                  onClick={() => deleteTodo(individualTodo.id)}
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
