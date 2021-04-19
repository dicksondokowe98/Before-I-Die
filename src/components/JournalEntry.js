import React, { useState, useEffect } from 'react';
import firebase from '../util/firebase';
import '../App.css';
import ReactGA from 'react-ga';
import Player from '../Player';
import { object } from 'prop-types';




var aItem = null;
var ana = function a(valude) {
    this.value = valude;
}
var aa = {};
aa = new ana(null);

var currentdate = new Date(); 
var datetime = "" + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + "@ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


                ReactGA.initialize('UA-000000-01');
                ReactGA.pageview(window.location.pathname + window.location.search);

export default function Todo({ spotifyApi, token, journalEntry }) {
    const [aToken, setToken] = useState(token);
    const [aItem, setItem] = useState();
    const [isEntryRendered, setEntryRendered] = useState(false);//initially false
    useEffect(() => { setItem(aItem)}, [aItem]);
    useEffect(() => { setToken(token) }, [token]);
    useEffect(() => {setEntryRendered(isEntryRendered)}, [isEntryRendered]);

  async function getSongSpotify(a) { 
  //if the user has authorised
  if (spotifyApi && token) {
        spotifyApi.setAccessToken(token);
        try {
            if(journalEntry.songId) {
                a.value = await spotifyApi.getTrack(journalEntry.songId).then(data => { 
                    setItem(data.body);
                    setEntryRendered(true);
                    if (token && aItem == undefined) //debugger call
                    return data.body
            });   
            }
        } catch (error) {
            console.log(error);
        }
  }
  }
  if (!isEntryRendered) {
       if (!aa.value) getSongSpotify(aa); 
  }

  console.log("aItem i.e song track used as a state: " + aItem);
  return (
    <div className='entry'style={{width:'100%', position:'relative', boxSizing:'border-box', display:'flex'}} >
        { spotifyApi && token && aItem && (         <Player
              item={aItem}
              is_playing={false}
              progress_ms={0}
            />)}
        <div className='entryTitle'style={{width:'90%',float:'left', boxSizing:'border-box', overflowWrap: 'break-word'}} >
            <p className={journalEntry.complete ? 'complete' : 'beforeIDieEntry'}>{journalEntry.title}</p>
        </div>
        <div className='entryPlaceAndTime' style={{width:'9%',boxSizing:'border-box', float:'right', color:'grey'}}>
            <h6> {journalEntry.city? journalEntry.city + ', ' : journalEntry.city} {journalEntry.date}</h6>
        </div>
    </div>
  );
}
