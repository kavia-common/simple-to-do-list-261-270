import React, { useEffect, useState, useCallback } from "react";
import "./theme.css";
import Header from "./components/Header";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Footer from "./components/Footer";
import { getStoredTodos, setStoredTodos } from "./services/storage";
import { api } from "./services/api";

// Utility to generate unique ids in-memory
function uid() {
  return (
    "t" +
    Date.now().toString(36) +
    Math.random().toString(36).substr(2, 5)
  );
}

// PUBLIC_INTERFACE
export default function App() {
  // Each todo: { id, text, completed }
  const [todos, setTodos] = useState([]);
  // Theme is always light per style guide
  useEffect(() => {
    document.body.style.background = "var(--color-background)";
    document.body.style.color = "var(--color-text)";
  }, []);

  // On load: localStorage (can extend to API in future)
  useEffect(() => {
    if (api.isEnabled) {
      // Possible place to fetch from API
    } else {
      setTodos(getStoredTodos());
    }
  }, []);

  // Save changes to storage when todos change
  useEffect(() => {
    if (!api.isEnabled) setStoredTodos(todos);
  }, [todos]);

  // PUBLIC_INTERFACE
  const addTodo = useCallback((text) => {
    setTodos((prev) => [
      ...prev,
      {
        id: uid(),
        text,
        completed: false
      }
    ]);
  }, []);

  // PUBLIC_INTERFACE
  const toggleTodo = useCallback((id) => {
    setTodos((prev) =>
      prev.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );
  }, []);

  // PUBLIC_INTERFACE
  const deleteTodo = useCallback((id) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="todo-app-container" role="main" aria-label="Todo List Application">
      <Header total={todos.length} remaining={remaining} />
      <TodoInput onAdd={addTodo} />
      <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
      <Footer />
    </div>
  );
}
