import React, { useState, useRef } from "react";

// PUBLIC_INTERFACE
export default function TodoInput({ onAdd }) {
  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  const handleChange = (e) => setValue(e.target.value);

  const submit = () => {
    if (value.trim() !== "") {
      onAdd(value.trim());
      setValue("");
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    }
  };

  return (
    <div className="todo-input-bar">
      <input
        ref={inputRef}
        type="text"
        aria-label="New Task"
        placeholder="What needs to be done?"
        value={value}
        maxLength={120}
        autoComplete="off"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button
        type="button"
        aria-label="Add task"
        onClick={submit}
        disabled={!value.trim()}
      >
        Add
      </button>
    </div>
  );
}
