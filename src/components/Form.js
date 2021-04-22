import React, { useState } from 'react';
import firebase from '../util/firebase';
import $ from 'jquery';
import { object } from 'prop-types';
import SpotifyWebApi from 'spotify-web-api-node';

const Form = props => {
  const [title, setTitle] = useState('');
  const [songId, setSong] = useState(null);

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
  };

  
  const createJournalEntry = () => {
    const journalEntryRef = firebase.database().ref('journalEntry');
    try {
      
    } catch (error) {
        console.log(error);
    }

    localStorage.setItem('item', JSON.stringify(props.item));
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
      window.location.reload();
    });

  };
  return (
    <div style={{position:"fixed", top:"400px", left:"800px"}}>
        <textarea name="txtDescEd" cols="60" rows="10" value={title} onChange={handleOnChange}
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
