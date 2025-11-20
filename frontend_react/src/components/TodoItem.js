import React from "react";

// PUBLIC_INTERFACE
export default function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <li
      className={`todo-item${todo.completed ? " completed" : ""}`}
      tabIndex={-1}
    >
      <input
        className="todo-checkbox"
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? "incomplete" : "completed"}`}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            onToggle(todo.id);
            e.preventDefault();
          }
        }}
      />
      <span className="todo-text">{todo.text}</span>
      <button
        className="todo-delete-btn"
        aria-label={`Delete "${todo.text}"`}
        onClick={() => onDelete(todo.id)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === " " || e.key === "Enter") {
            onDelete(todo.id);
            e.preventDefault();
          }
        }}
        title="Delete"
      >
        &times;
      </button>
    </li>
  );
}
