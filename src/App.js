import React, {useEffect} from 'react';
import './App.css';
import Form from './components/Form';
import JournalEntriesList from './components/JournalEntriesList';
import UploadImage from './components/UploadImage';
import firebase from './util/firebase';
import PageViewCounter from './components/PageViewCounter';

import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import logo from "./music.svg";
import equal from 'fast-deep-equal';
import { throwStatement } from '@babel/types';

var SpotifyWebApi = require('spotify-web-api-node');
var pageOfSavedTracks = [];
var AllSavedTracks = [];
// credentials are optional
var spotifyApi = new SpotifyWebApi({
    clientId: '4753f10680f943c5845424eda8abb1d3',
    clientSecret: '3154e4ecff3d40a1b73628a26743aba8',
    redirectUri: 'http://localhost:3000/redirect'
  });
  var scopess = [
    "user-top-read",
    "user-read-currently-playing",
    "user-read-playback-state",
];

Date.prototype.withoutTime = function () {
    var d = new Date(this);
    d.setHours(0, 0, 0, 0);
    return d;
}

Date.prototype.toIsoString = function() {
    var tzo = -this.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            var norm = Math.floor(Math.abs(num));
            return (norm < 10 ? '0' : '') + norm;
        };
    return this.getFullYear() +
        '-' + pad(this.getMonth() + 1) +
        '-' + pad(this.getDate()) +
        'T' + pad(this.getHours()) +
        ':' + pad(this.getMinutes()) +
        ':' + pad(this.getSeconds()) +
        'Z';
}
const doSomething = (value, total, alls) =>
  new Promise(resolve => 
    resolve(value >= 2  ? 'ok': 'no'))

    const loop = async (value, alls) => {
        let result = null
        var total = 0;
        var allSongs = ['allsongs'];

        var go = await spotifyApi.getMySavedTracks({limit:1,offset:0}).then(function(data) {total =  data.body.total; alls = data.body.items});
        while (result != 'ok') {
          //spotify
          var gg = await spotifyApi.getMySavedTracks({
            limit : 50,
            offset: 0        
        })
          .then(function(data) {
            pageOfSavedTracks = data.body.items;
            alls = alls.concat(data.body.items);
          }, function(err) {
            console.log('Something went wrong!', err);
          });


          result = await doSomething(value, total, alls)
          value = value + 50
        }

        return alls;
      }




export default class App extends React.Component {
    constructor() {
      super();
      this.state = {
         spotifyApi : new SpotifyWebApi({
            clientId: '4753f10680f943c5845424eda8abb1d3',
            clientSecret: '3154e4ecff3d40a1b73628a26743aba8',
            redirectUri: 'http://localhost:3000/redirect'
          }),
        token: hash.access_token,
        isThereANewEntry: false,
        item: {
          album: {
            images: [{ url: "" }]
          },
          name: "",
          artists: [{ name: "" }],
          duration_ms: 0
        },
        is_playing: "Paused",
        progress_ms: 0,
        no_data: false,
      };
      this.updateOnNewEntry = this.updateOnNewEntry.bind(this);//clearly comment what this is doing, roughly it is making updateonentry visible to child components if passsed doen as a function
    }

    updateOnNewEntry() {
        this.setState({
            isThereANewEntry: true,
        })
    }


    
    componentDidMount() {
        // Set token
        let _token = hash.access_token;
    
        if (_token) {
          // Set token
          this.setState({
            token: _token
          });
          this.getCurrentlyPlaying(_token);
          spotifyApi.setAccessToken(_token);
          var alltracks = [];
              var dd = new Date();
          loop(1, ['a']).then((res) => {
              var date2 = new Date();
              var aSongFromToday = "";
              var todaysSongsList = [];
              var isFirstSongOfToday = true;
              var date1;

              for (let entry of res) {
                date1 = new Date(entry.added_at);
                  
                //dates.compare(new Date(), date1);
                var a = date2.withoutTime().getTime();
                var b = date1.withoutTime().getTime()

                if (!(date2.withoutTime().getTime() === date1.withoutTime().getTime())) {
                  break;
                }
                else {
                    aSongFromToday = entry.track.id;
                    spotifyApi.getTrack(aSongFromToday).then(data => {

                        if(isFirstSongOfToday) {
                        this.setState({
                            item: data.body,
                            is_playing: data.is_playing,
                            progress_ms: data.progress_ms,
                            no_data: false /* We need to "reset" the boolean, in case the
                          user does not give F5 and has opened his Spotify. */
                          });          
                          isFirstSongOfToday = false;                         
                        } else {
                            todaysSongsList.push(data.body);
                          }
                        });
                }
            }                       
            });
        }
        // set interval for polling every 5 seconds
        //this.interval = setInterval(() => this.tick(), 5000);
    }
    
    componentDidUpdate() {
        if(this.state.isThereANewEntry) {
            loop(1, ['a']).then((res) => {
                var date2 = new Date();
                var todaysSong = "";
                var date1;
  
                for (let entry of res) {
                  date1 = new Date(entry.added_at);
                    
                  //dates.compare(new Date(), date1);
                  var a = date2.withoutTime().getTime();
                  var b = date1.withoutTime().getTime()
  
                  if (!(date2.withoutTime().getTime() === date1.withoutTime().getTime())) {
                    break;
                  }
                  else {
  
                    todaysSong = entry.track.id;
                    spotifyApi.getTrack(todaysSong).then(data => {
                      
                      this.setState({
      isThereANewEntry: false,
      item: data.body,
      is_playing: data.is_playing,
      progress_ms: data.progress_ms,
      no_data: false /* We need to "reset" the boolean, in case the
                        user does not give F5 and has opened his Spotify. */
    });
    })
                  }               
                }
  
  
                    
            });
        }
    }
      componentWillUnmount() {
        // clear the interval to save resources
        clearInterval(this.interval);
      }


    
      tick() {
        if(this.state.token) {
          this.getCurrentlyPlaying(this.state.token);
        }
      }


      getCurrentlyPlaying(token) {
        // Make a call using the token
        $.ajax({
          url: "https://api.spotify.com/v1/me/player",
          type: "GET",
          beforeSend: xhr => {
            xhr.setRequestHeader("Authorization", "Bearer " + token);
          },
          success: data => {
            // Checks if the data is not empty
            if(!data) {
              this.setState({
                no_data: true,
              });
              return;
            }
    
            this.setState({
              item: data.item,
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
              no_data: false /* We need to "reset" the boolean, in case the
                                user does not give F5 and has opened his Spotify. */
            });
          }
        });
      }

    render() {

  return (
    <div className="App">
                  <img src={logo} className="App-log" alt="log" />
          {!this.state.token && (
            <a
              className="btn btn--loginApp-link"
              href={`${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join(
                "%20"
              )}&response_type=token&show_dialog=true`}
            >
              Login to Spotify
            </a>
          )}
          {this.state.token && !this.state.no_data && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />
          )}
          {this.state.no_data && (
            <p>
              You need to be playing a song on Spotify, for something to appear here.
            </p>
          )}
      <h1>Music Journal
          
      </h1>
      <Form 
        item={this.state.item}
        updateOnNewEntry={this.updateOnNewEntry}/>
      <JournalEntriesList spotifyApi={this.state.spotifyApi}  token={this.state.token} isThereANewEntry={this.state.isThereANewEntry}/>
      <PageViewCounter />
    </div>
          
  );
          }
}
