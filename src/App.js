import React from 'react';
import './App.css';
import Form from './components/Form';
import TodoList from './components/TodoList';
import UploadImage from './components/UploadImage';
import firebase from './util/firebase';
import PageViewCounter from './components/PageViewCounter';

import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import logo from "./music.svg";


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
    resolve(value >= 100  ? 'ok': 'no'))

    const loop = async (value, alls) => {
        let result = null
        var total = 0;
        var allSongs = ['allsongs'];

        var go = await spotifyApi.getMySavedTracks({limit:1,offset:0}).then(function(data) {total =  data.body.total; alls = data.body.items});
        while (result != 'ok') {
          console.log(value)
          //spotify
          var gg = await spotifyApi.getMySavedTracks({
            limit : 50,
            offset: value
          
        })
          .then(function(data) {
            pageOfSavedTracks = data.body.items;
            alls = alls.concat(data.body.items);
            //tracks =[["a"], ["b"]];// [AllSavedTracks, pageOfSavedTracks];
          }, function(err) {
            console.log('Something went wrong!', err);
          });


          result = await doSomething(value, total, alls)
          value = value + 50
        }
        console.log('yay')

        return alls;
      }
    
const go = async function() {
    let _token = hash.access_token;
    spotifyApi.setAccessToken(_token);

    loop(1, ['a']).then((res) => {
        console.log(res);
        var dd = new Date();
        var date2 = new Date(dd).toDateString();
        var todaysSong = "";
        res.forEach(entry => {
                  var date1 = new Date(entry.added_at).toDateString();if (date1 == date2) {todaysSong = entry.track.id; console.log(entry.track.id);}})
    
        spotifyApi.getTrack(todaysSong).then(data => {
        console.log(data.body);
        this.setState({
            item: data.body,
            is_playing: data.is_playing,
            progress_ms: data.progress_ms,
            no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
        });
        debugger;
        }) 
        })

}



export default class App extends React.Component {
    constructor() {
      super();
      this.state = {
        token: null,
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
              console.log(res);
              var date2 = new Date(dd).toDateString();
    
              var todaysSong = "";
              res.forEach(entry => {
                  var date1 = new Date(entry.added_at).toDateString();if (date1 == date2) {todaysSong = entry.track.id; console.log(entry.track.id);}})
    
                  spotifyApi.getTrack(todaysSong).then(data => {
                    console.log(data.body);
                    
                                    this.setState({
                    item: data.body,
                    is_playing: data.is_playing,
                    progress_ms: data.progress_ms,
                    no_data: false /* We need to "reset" the boolean, in case the
                                      user does not give F5 and has opened his Spotify. */
                  });
                  })
                  
          });
          }
    
        // set interval for polling every 5 seconds
        //this.interval = setInterval(() => this.tick(), 5000);
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
      <h1>Before I Die</h1>
      <Form />
      <TodoList />
      <PageViewCounter />
    </div>
          
  );
          }
}
