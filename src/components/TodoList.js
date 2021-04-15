import React, { useState, useEffect } from 'react';
import firebase from '../util/firebase';
import Todo from './Todo';

export default function TodoList() {
  const [todoList, setTodoList] = useState();

  useEffect(() => {
    const todoRef = firebase.database().ref('Todo');
    todoRef.on('value', (snapshot) => {
      const todos = snapshot.val();
      const todoList = [];
      for (let id in todos) {
        todoList.push({ id, ...todos[id] });
      }
      todoList.reverse();
      setTodoList(todoList);
    });
  }, []);

  return (
    <div style={{position:'relative', boxSizing:'border-box'}}>
      {todoList
        ? todoList.map((todo, index) => <Todo todo={todo} key={index} />)
        : ''}
    </div>
  );
}
