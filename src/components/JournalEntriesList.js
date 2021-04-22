import React, { useState, useEffect } from 'react';
import firebase from '../util/firebase';
import JournalEntry from './JournalEntry';


  const JournalEntriesList = props => {
    
  const [journalEntriesList, setJournalEntriesList] = useState();
  const [token, setToken] = useState(props.token);
  const [userId, setUserId] = useState();
  const [journalEntries, setJournalEntries] = useState();
  var journal = [];
  const [isReRenderNeeded, setReRender] = useState(props.isThereANewEntry);

    useEffect(() => {
        setJournalEntries(journalEntries)
    }, [journalEntries])

  useEffect(() => {
      setUserId(userId);
      for (let id in journalEntries) {
        if (journalEntries[id].userId == userId) {
            
          journal.push({ id, ...journalEntries[id] });           
        }
    }
    journal.reverse();
    setJournalEntriesList(journal);
    console.log(userId)

  },[userId]);
  useEffect(() => { setToken(props.token) }, [props.token]);
  useEffect(() => {
    const journalRef = firebase.database().ref('journalEntry');
    journalRef.once('value', (snapshot) => {
    setJournalEntries(snapshot.val());

    }).then(() => {
        props.spotifyApi.setAccessToken(token);
        if (token && props.spotifyApi) props.spotifyApi.getMe().then(data => {
            setUserId(data.body.id);

 
           //setToken(token);
       })
    });
  }, []);
  return (
    <div  style={{position:'relative', boxSizing:'border-box'}}>
      {journalEntriesList
        ? journalEntriesList.map((journalEntry, index) => <JournalEntry spotifyApi={props.spotifyApi} token={token} journalEntry={journalEntry} key={index} />)
        : ''}
    </div>
  );
}

export default JournalEntriesList
