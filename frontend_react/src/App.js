import React, { useEffect, useState, useCallback } from "react";
import "./theme.css";
import Navbar from "./components/Navbar";
import TodoInput from "./components/TodoInput";
import TodoList from "./components/TodoList";
import Footer from "./components/Footer";
import { getStoredTodos, setStoredTodos } from "./services/storage";
import { api } from "./services/api";
import { Modal } from "./components/Modal";

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

  // Modal demo state
  const [isModalOpen, setModalOpen] = useState(false);

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
    <div style={{ minHeight: "100vh", background: "var(--color-background)" }}>
      <Navbar />
      <main
        className="todo-app-container"
        role="main"
        aria-label="Todo List Application"
        style={{ marginTop: 24 }} // Room under navbar
      >
        {/* Remove Header (title/count) to not duplicate with Navbar */}
        {/* <Header total={todos.length} remaining={remaining} /> */}
        <div style={{ textAlign: "center", marginTop: "1.7em", marginBottom: "0.7em" }}>
          <div className="todo-title" style={{ color: "var(--color-primary)", fontSize: "2rem", fontWeight: "bold", marginBottom: 6 }}>
            Simple To-Do List
          </div>
          <div className="todo-count" style={{ fontSize: "1rem", color: "var(--color-secondary)", margin: 0 }}>
            {todos.length === 0
              ? "Get started by adding a task"
              : `${remaining} ${remaining === 1 ? "task" : "tasks"} left`}
          </div>
        </div>
        <div style={{ textAlign: "center", marginBottom: 18 }}>
          <button
            className="modal-demo-btn"
            type="button"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              border: "none",
              borderRadius: 8,
              fontWeight: 600,
              padding: "9px 26px",
              fontSize: "1.07rem",
              margin: "0 0.5em",
              boxShadow: "0 1px 3.5px 0 rgba(59,130,246, .08)",
              cursor: "pointer",
              transition: "background 0.21s"
            }}
            onClick={() => setModalOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={isModalOpen}
          >
            Demo Modal
          </button>
        </div>
        <TodoInput onAdd={addTodo} />
        <TodoList todos={todos} onToggle={toggleTodo} onDelete={deleteTodo} />
        <Footer />
      </main>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Demo Modal"
        size="md"
        footer={
          <>
            <button
              className="btn btn-cancel"
              onClick={() => setModalOpen(false)}
              type="button"
              autoFocus
            >
              Cancel
            </button>
            <button
              className="btn btn-success"
              onClick={() => {
                // Demo confirm action
                // eslint-disable-next-line no-console
                console.log("Confirmed from modal!");
                setModalOpen(false);
              }}
              type="button"
            >
              Confirm
            </button>
          </>
        }
      >
        <div style={{ paddingBottom: 4 }}>
          This is a fully accessible, theme-styled Modal component.
          <br />
          • Press <kbd>ESC</kbd> to close.<br />
          • Focus is trapped inside.<br />
          • Overlay click closes (outside dialog).
        </div>
      </Modal>
      {/* Modal root for portal fallback */}
      <div id="modal-root" style={{ display: "contents" }} />
    </div>
  );
}
