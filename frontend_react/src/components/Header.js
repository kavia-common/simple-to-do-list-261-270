import React from "react";

// PUBLIC_INTERFACE
export default function Header({ total, remaining }) {
  return (
    <header>
      <h1 className="todo-title">Simple To-Do List</h1>
      <div className="todo-count">
        {total === 0
          ? "Get started by adding a task"
          : `${remaining} ${remaining === 1 ? "task" : "tasks"} left`}
      </div>
    </header>
  );
}
