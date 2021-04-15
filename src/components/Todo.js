import React from 'react';
import firebase from '../util/firebase';
import '../App.css';
import ReactGA from 'react-ga';






var currentdate = new Date(); 
var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "@ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();





                ReactGA.initialize('UA-000000-01');
                ReactGA.pageview(window.location.pathname + window.location.search);

export default function Todo({ todo }) {
  const deleteTodo = () => {
    const todoRef = firebase.database().ref('Todo').child(todo.id);
    todoRef.remove();
  };
  const completeTodo = () => {
    const todoRef = firebase.database().ref('Todo').child(todo.id);
    todoRef.update({
      complete: !todo.complete,
    });
  };
  return (
    <div className='entry'style={{width:'100%', position:'relative', boxSizing:'border-box', display:'flex'}} >
        <div className='entryTitle'style={{width:'90%',float:'left',boxSizing:'border-box', overflowWrap: 'break-word'}} >
            <p className={todo.complete ? 'complete' : 'beforeIDieEntry'}>{todo.title}</p>
        </div>
        <div className='entryPlaceAndTime' style={{width:'9%',boxSizing:'border-box', float:'right', color:'grey'}}>
            <h6> {todo.city? todo.city + ', ' : todo.city} {todo.date}</h6>
        </div>
    </div>
  );
}
