const STORAGE_KEY = "todo_app_tasks";

// PUBLIC_INTERFACE
export function getStoredTodos() {
  const data = localStorage.getItem(STORAGE_KEY);
  try {
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

// PUBLIC_INTERFACE
export function setStoredTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
