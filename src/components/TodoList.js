import React, { useState, useEffect } from 'react';
import firebase from '../util/firebase';
import Todo from './Todo';


  const TodoList = props => {
  const [todoList, setTodoList] = useState();
  const [token, setToken] = useState(props.token);


  useEffect(() => { setToken(props.token) }, [props.token]);
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
      //setToken(token);
    });
  }, []);

  return (
    <div  style={{position:'relative', boxSizing:'border-box'}}>
      {todoList
        ? todoList.map((todo, index) => <Todo spotifyApi={props.spotifyApi} token={token} todo={todo} key={index} />)
        : ''}
    </div>
  );
}

export default TodoList
