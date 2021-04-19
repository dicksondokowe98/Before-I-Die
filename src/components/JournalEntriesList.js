import React, { useState, useEffect } from 'react';
import firebase from '../util/firebase';
import JournalEntry from './JournalEntry';


  const JournalEntriesList = props => {
  const [journalEntriesList, setJournalEntriesList] = useState();
  const [token, setToken] = useState(props.token);
  const [isReRenderNeeded, setReRender] = useState(props.isThereANewEntry);


  useEffect(() => { setToken(props.token) }, [props.token]);
  useEffect(() => {
    const journalRef = firebase.database().ref('journalEntry');
    journalRef.on('value', (snapshot) => {
      const journalEntries = snapshot.val();
    
      const journal = [];
      for (let id in journalEntries) {
        journal.push({ id, ...journalEntries[id] });
      }
      journal.reverse();
      setJournalEntriesList(journal);
      //setToken(token);
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
