/**
 * API client for Todo app.
 * Determines base URL from environment variables, but not active unless base URL exists.
 */

const API_BASE =
  process.env.REACT_APP_API_BASE ||
  process.env.REACT_APP_BACKEND_URL ||
  "";

// Add actual API logic here in the future.
const isEnabled = !!API_BASE;

export const api = {
  isEnabled,
  // Example interface for future use
  listTasks: async () => {
    throw new Error("API method not implemented.");
  },
  addTask: async (task) => {
    throw new Error("API method not implemented.");
  },
  updateTask: async (task) => {
    throw new Error("API method not implemented.");
  },
  deleteTask: async (id) => {
    throw new Error("API method not implemented.");
  }
};
