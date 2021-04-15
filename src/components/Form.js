import React, { useState } from 'react';
import firebase from '../util/firebase';
import $ from 'jquery';
import { object } from 'prop-types';

export default function Form() {
  const [title, setTitle] = useState('');
  const aCity = {
      name: 'not changed city nsmr'
  }
  function isEmptyOrSpaces(str){
    return str === null || str.match(/^ *$/) !== null;
}

function ipLookUp (aCity) {
    $.ajax('http://ip-api.com/json')
    .then(
        function success(response) {
            aCity.name = response.city;
            {createTodo()}
        },
  
        function fail(data, status) {
            console.log('Request failed.  Returned status of',
                        status);
        }
    );
  }





  const handleOnChange = (e) => {
    setTitle(e.target.value);
  };


  const createTodo = () => {
    const todoRef = firebase.database().ref('Todo');
    var messageCreatedDate = new Date(Date.now()).toLocaleString();

    const todo = {
      title,
      complete: false,
      date: messageCreatedDate,
      city: aCity.name
    };

    todoRef.push(todo);
  };
  return (
    <div style={{position:'relative'}}>
      <input 
      placeholder="I want to..."
      type="text" style={{width: "370px"}} onChange={handleOnChange}
      onKeyPress={event => {
        if (event.key === 'Enter') {
            if (!isEmptyOrSpaces(title)) {
                ipLookUp(aCity);
                setTitle("")
            }

        }
      }}
      
       value={title} />
    </div>
  );
}
