import React from 'react';
import './App.css';
import Form from './components/Form';
import TodoList from './components/TodoList';
import UploadImage from './components/UploadImage';

export default function App() {
  return (
    <div className="App">
      <h1>Before I Die I Want To...</h1>
      <Form />
      <TodoList />
    </div>
  );
}
