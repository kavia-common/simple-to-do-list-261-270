import React from "react";
import TodoItem from "./TodoItem";

// PUBLIC_INTERFACE
export default function TodoList({ todos, onToggle, onDelete }) {
  if (!todos.length) {
    return <div className="todo-list-empty">No tasks yet.</div>;
  }
  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
