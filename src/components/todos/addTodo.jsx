// eslint-disable-next-line react/prop-types
const AddTodos = ({ value, onInputchange, onAddTodo }) => {
  return (
    <div className=" flex gap-2">
      <input
        placeholder="add todo"
        name="todo"
        value={value}
        onChange={onInputchange}
        className="border-1 border-gray-800 rounded flex-1"
      />
      <button
        className="border border-gray-500 px-2 py-1 rounded"
        onClick={onAddTodo}
      >
        Add
      </button>
    </div>
  );
};
export default AddTodos;
