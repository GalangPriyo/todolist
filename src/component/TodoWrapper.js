import React, { useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import { TodoForm } from "./TodoForm";
import { Todo } from "./Todo";

const GET_TODOS = gql`
  query GetTodos {
    todos {
      id
      text
      completed
    }
  }
`;

const ADD_TODO = gql`
  mutation AddTodo($text: String!) {
    addTodo(text: $text) {
      id
      text
      completed
    }
  }
`;

const TOGGLE_TODO_COMPLETED = gql`
  mutation ToggleTodoCompleted($id: ID!) {
    toggleTodoCompleted(id: $id) {
      id
      text
      completed
    }
  }
`;

const DELETE_TODO = gql`
  mutation DeleteTodo($id: ID!) {
    deleteTodo(id: $id)
  }
`;

export const TodoWrapper = () => {
  const { loading, error, data } = useQuery(GET_TODOS);
  const [addTodo] = useMutation(ADD_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [toggleTodoCompleted] = useMutation(TOGGLE_TODO_COMPLETED, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [deleteTodo] = useMutation(DELETE_TODO, {
    refetchQueries: [{ query: GET_TODOS }],
  });
  const [filter, setFilter] = useState("all");

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleAddTodo = (text) => {
    addTodo({ variables: { text } });
  };

  const handleToggleComplete = (id) => {
    toggleTodoCompleted({ variables: { id } });
  };

  const handleDeleteTodo = (id) => {
    deleteTodo({ variables: { id } });
  };

  const filteredTodos = data.todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "active") return !todo.completed;
    return true;
  });

  return (
    <div className="TodoWrapper">
      <h1>Catatan Kegiatan</h1>
      <TodoForm addTodo={handleAddTodo} />
      <select
        className="Filter"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All</option>
        <option value="active">Uncompleted</option>
        <option value="completed">Completed</option>
      </select>
      {filteredTodos.map((todo) => (
        <Todo
          task={todo}
          key={todo.id}
          toggleComplete={handleToggleComplete}
          deleteTodo={handleDeleteTodo}
        />
      ))}
    </div>
  );
};
