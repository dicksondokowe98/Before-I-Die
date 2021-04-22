import React, { useState } from 'react';
import firebase from '../util/firebase';
import $ from 'jquery';
import { object } from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-node';

const Form = props => {
  const [title, setTitle] = useState('');
  const [songId, setSong] = useState('');

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
            {createJournalEntry()};
            this.props.updateOnNewEntry();
        },
  
        function fail(data, status) {
            console.log('Request failed.  Returned status of',
                        status);
        }
    );
  }





  const handleOnChange = (e) => {
    setTitle(e.target.value);
    setSong(props.item.id);
  };

  
  const createJournalEntry = () => {
    const journalEntryRef = firebase.database().ref('journalEntry');

    props.spotifyApi.getMe().then((data) => {
        //console.log(data);
    var messageCreatedDate = new Date(Date.now()).toLocaleString();        
    const journalEntry = {
        title,
        complete: false,
        date: messageCreatedDate,
        city: aCity.name,
        songId: songId,
        userId: data.body.id
      };
      journalEntryRef.push(journalEntry);
    });

  };
  return (
    <div style={{position:'relative', display: "inline-block"}}>
      <input 
      placeholder="The song reminds me of..."
      type="text" style={{width: "450px", height: "100px"}} onChange={handleOnChange}
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

export default Form;
