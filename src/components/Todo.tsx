"use client";

import React, { useState, useEffect } from 'react';
import { Check, Plus, Trash2, X } from 'lucide-react';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

const Todo: React.FC = () => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState<string>('');

  // Load todos from localStorage on component mount
  useEffect(() => {
    const savedTodos = localStorage.getItem('admin-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);

  // Save todos to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('admin-todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (newTodo.trim() === '') return;
    
    const newItem: TodoItem = {
      id: Date.now(),
      text: newTodo,
      completed: false
    };
    
    setTodos([...todos, newItem]);
    setNewTodo('');
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">Task Management</h1>
      
      {/* Add new todo */}
      <div className="flex mb-6">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={addTodo}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-r-md transition-colors"
        >
          <Plus className="w-5 h-5" />
        </button>
      </div>
      
      {/* Todo list */}
      <div className="space-y-3">
        {todos.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks yet. Add one above!</p>
        ) : (
          todos.map(todo => (
            <div 
              key={todo.id} 
              className={`flex items-center justify-between p-3 border rounded-md transition-all ${
                todo.completed 
                  ? 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600' 
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600'
              }`}
            >
              <div className="flex items-center flex-1">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`w-5 h-5 rounded-full mr-3 flex items-center justify-center ${
                    todo.completed 
                      ? 'bg-green-500 text-white' 
                      : 'border-2 border-gray-300 dark:border-gray-500'
                  }`}
                >
                  {todo.completed && <Check className="w-3 h-3" />}
                </button>
                <span 
                  className={`flex-1 ${
                    todo.completed 
                      ? 'text-gray-500 dark:text-gray-400 line-through' 
                      : 'text-gray-800 dark:text-white'
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Summary */}
      {todos.length > 0 && (
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>
            {todos.filter(t => t.completed).length} of {todos.length} tasks completed
          </p>
        </div>
      )}
    </div>
  );
};

export default Todo; 