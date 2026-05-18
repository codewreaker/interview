/**
 * Interview Question: React Technical Interview - Todo App
 * 
 * Objective:
 * Build a Todo application with Create, Read, Update, Delete operations.
 * This is a comprehensive React interview question testing:
 * - Component composition and state management
 * - Props and TypeScript interfaces
 * - Event handling
 * - List rendering with keys
 * - Controlled components
 * - React hooks (useState, useCallback, useMemo)
 * 
 * Requirements:
 * - Display a list of todos
 * - Add new todos with a form
 * - Mark todos as complete/incomplete
 * - Edit existing todos
 * - Delete todos
 * - Filter todos (all, active, completed)
 * - Persist to localStorage (bonus)
 * - Show count of active/completed todos
 * 
 * Follow-up questions to consider:
 * - How would you optimize rendering with large lists?
 * - How would you handle async operations like saving to a database?
 * - How would you structure this with Redux or Context API?
 * - How would you add undo/redo functionality?
 * 
 * UI Mockup:
 * ┌─────────────────────────────┐
 * │ Todo App                    │
 * ├─────────────────────────────┤
 * │ [Add Todo Input] [+ Add]    │
 * ├─────────────────────────────┤
 * │ Filter: All | Active | Done │
 * ├─────────────────────────────┤
 * │ [✓] Todo 1         [Edit][X]│
 * │ [ ] Todo 2         [Edit][X]│
 * │ [✓] Todo 3         [Edit][X]│
 * ├─────────────────────────────┤
 * │ Active: 1 | Completed: 2    │
 * └─────────────────────────────┘
 */

import React, { useState, useCallback, useMemo } from "react";

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
}

export type FilterType = "all" | "active" | "completed";

export const TodoApp: React.FC = () => {
  // TODO: Implement the Todo App component
  
  /*
  const [todos, setTodos] = useState<Todo[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [filter, setFilter] = useState<FilterType>("all");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const addTodo = useCallback((text: string) => {
    if (text.trim()) {
      const newTodo: Todo = {
        id: Date.now().toString(),
        text: text.trim(),
        completed: false,
        createdAt: new Date(),
      };
      setTodos(prev => [...prev, newTodo]);
      setInputValue("");
    }
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const startEdit = useCallback((todo: Todo) => {
    setEditingId(todo.id);
    setEditValue(todo.text);
  }, []);

  const saveEdit = useCallback((id: string) => {
    setTodos(prev =>
      prev.map(todo =>
        todo.id === id ? { ...todo, text: editValue } : todo
      )
    );
    setEditingId(null);
  }, [editValue]);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case "active":
        return todos.filter(todo => !todo.completed);
      case "completed":
        return todos.filter(todo => todo.completed);
      case "all":
      default:
        return todos;
    }
  }, [todos, filter]);

  const stats = useMemo(() => {
    return {
      total: todos.length,
      active: todos.filter(t => !t.completed).length,
      completed: todos.filter(t => t.completed).length,
    };
  }, [todos]);

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <div className="input-section">
        <input
          type="text"
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyPress={e => {
            if (e.key === "Enter") {
              addTodo(inputValue);
            }
          }}
          placeholder="Add a new todo..."
        />
        <button onClick={() => addTodo(inputValue)}>Add</button>
      </div>

      <div className="filter-section">
        {(["all", "active", "completed"] as FilterType[]).map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      <ul className="todo-list">
        {filteredTodos.map(todo => (
          <li key={todo.id} className={todo.completed ? "completed" : ""}>
            {editingId === todo.id ? (
              <>
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyPress={e => {
                    if (e.key === "Enter") {
                      saveEdit(todo.id);
                    }
                  }}
                />
                <button onClick={() => saveEdit(todo.id)}>Save</button>
              </>
            ) : (
              <>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  aria-label={`Mark ${todo.text} as ${todo.completed ? "incomplete" : "complete"}`}
                />
                <span>{todo.text}</span>
                <button
                  onClick={() => startEdit(todo)}
                  aria-label={`Edit ${todo.text}`}
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteTodo(todo.id)}
                  aria-label={`Delete ${todo.text}`}
                >
                  Delete
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="stats">
        <p>Total: {stats.total}</p>
        <p>Active: {stats.active}</p>
        <p>Completed: {stats.completed}</p>
      </div>
    </div>
  );
  */

  return <div>Todo App placeholder</div>;
};

export default TodoApp;
