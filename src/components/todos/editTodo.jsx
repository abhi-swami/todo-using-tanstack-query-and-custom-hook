import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const EditTodo = ({ todo, isOpen, onClose, onEdit }) => {
  // eslint-disable-next-line react/prop-types

  const [editTodo, setEditTodo] = useState({ ...todo });
  console.log("ei", editTodo, todo);

  const onInputchange = (event) => {
    setEditTodo({ ...editTodo, title: event.target.value });
  };

  const handleEditTodo = () => {
    console.log("toso", editTodo);
    onEdit(editTodo)
  };

  useEffect(() => {
    setEditTodo({ ...todo });
  }, [todo]);
  return (
    <div
      className={`absolute top-0 left-0 w-full h-[100vh] ${
        isOpen ? "block" : "hidden"
      } mx-auto border border-red-800 bg-gray-600`}
    >
      <div className="mx-auto bg-white w-2xl h-[50%] rounded flex justify-center items-cente">
        <div className="flex gap-2 justify-center items-center m-auto max-w-[90%]">
          <input
            placeholder="edit todo"
            name="todo"
            value={editTodo.title}
            onChange={onInputchange}
            className="border-1 border-gray-800 rounded flex-1 p-1"
          />
          <button
            className="border border-gray-500 px-2 py-1 rounded"
            onClick={handleEditTodo}
          >
            Edit
          </button>
        </div>
      </div>
      <button
        className="absolute top-0 right-2 text-lg text-white "
        onClick={onClose}
      >
        x
      </button>
    </div>
  );
};

export default EditTodo;
