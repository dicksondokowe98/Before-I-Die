import React, { useState } from 'react';
import firebase from '../util/firebase';
import $ from 'jquery';
import { object } from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-node';

const Form = props => {
  const [title, setTitle] = useState('');
  const [songId, setSong] = useState(null);
  const [songTitle, setSongTitle] = useState(null);
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
    setSong(props.item.id);//not the best place to call this, i think it's ending up setting the state for every key pressedf
    setSongTitle(props.item.name);
  };

  
  const createJournalEntry = () => {

    const journalEntryRef = firebase.database().ref('journalEntry');

    localStorage.setItem('item', JSON.stringify(props.item));
    props.spotifyApi.getMe().then((data) => {
    console.log(data);
    var messageCreatedDate = new Date(Date.now()).toLocaleString();        
    const journalEntry = {
        title,
        complete: false,
        date: messageCreatedDate,
        city: aCity.name,
        songId: songId,
        songTitle: songTitle,
        userId: data.body.id
      };
      journalEntryRef.push(journalEntry);
      window.location.reload();
    });

  };
  return (
    <div style={{position:"relative", width:"50%", top:"10%", marginLeft:"0%"}}>
        <textarea name="txtDescEd" cols="60" rows="30" value={title} onChange={handleOnChange}
        placeholder="What does the song remind you of?"
              onKeyPress={event => {
        if (event.key === 'Enter') {
            if (!isEmptyOrSpaces(title)) {
                ipLookUp(aCity);


                setTitle("")
            }

        }
      }}
      />
    </div>
  );
}

export default Form;
