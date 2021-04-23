import React, {useEffect, useLayoutEffect, useState} from 'react';
import './App.css';
import Form from './components/Form';
import JournalEntriesList from './components/JournalEntriesList';
import UploadImage from './components/UploadImage';
import firebase from './util/firebase';
import PageViewCounter from './components/PageViewCounter';
import Signup from './components/pages/Signup';
import * as $ from "jquery";
import { authEndpoint, clientId, redirectUri, scopes } from "./config";
import hash from "./hash";
import Player from "./Player";
import logo from "./music.svg";
import equal from 'fast-deep-equal';
import { throwStatement } from '@babel/types';
import Main from './components/Main';
import Navigation from './components/Navigation'
import Search from './components/Search'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    withRouter
  } from "react-router-dom";
import { localeLowerCase } from 'lower-case';

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
    "user-library-read"
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
    resolve(value >= 1  ? 'ok': 'no'))

    const loop = async (value, alls, token) => {
        let result = null
        var total = 0;
        var allSongs = ['allsongs'];

        while (result != 'ok') {
    //         await $.ajax({
    //             url: "https://api.spotify.com/v1/me/tracks?limit=1&offset=0",
    //             type: "GET",
    //             beforeSend: xhr => {
    //                 xhr.setRequestHeader('Accept', 'application/json');
    // xhr.setRequestHeader('Content-Type', 'application/json');
    //               xhr.setRequestHeader("Authorization", "Bearer " + token);
    //             }}).done(data => {

    //             pageOfSavedTracks = data.items;
    //             alls = alls.concat(data.items);
    //             debugger;
    //             return alls;
    //           });
            spotifyApi.setAccessToken(token);
            var res = await spotifyApi.getMySavedTracks({limit: 10});
            alls = alls.concat(res.body.items);

          result = await doSomething(value, total, alls)
          value = value + 50;
        }

        return alls;
      }




export default class App extends React.Component {
    constructor() {
      super();
      this.state = {
        selectedOption: localStorage.getItem( 'SelectedOption' ) || 1,
         spotifyApi : new SpotifyWebApi(JSON.parse(localStorage.getItem('spotifyApi'))) || new SpotifyWebApi({
            clientId: '4753f10680f943c5845424eda8abb1d3',
            clientSecret: '3154e4ecff3d40a1b73628a26743aba8',
            redirectUri: 'http://localhost:3000/redirect'
          }),
        token: localStorage.getItem('token') || hash.access_token,
        isThereANewEntry: localStorage.getItem('isThereANewEntry') || false,
        isSignedIn: localStorage.getItem( 'isSignedIn' ) || false,

        item: JSON.parse(localStorage.getItem('item')) || {
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
      this.state.spotifyApi.setAccessToken(this.state.token);
      this.getPlaying = this.getPlaying.bind(this);
      this.updateOnNewEntry = this.updateOnNewEntry.bind(this);//clearly comment what this is doing, roughly it is making updateonentry visible to child components if passsed doen as a function
    }

    updateOnNewEntry() {
        this.setState({
            isThereANewEntry: true,
        })
    }

    async getPlaying(token) {
        // Make a call using the token
        await $.ajax({
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
            localStorage.setItem('item', JSON.stringify(data.item));
            this.setState({
              item: data.item,
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
              no_data: false 
            });
          }
        });
      }
    
    componentDidMount() {
        window.addEventListener('resize', this.resize);
        // Set token
        let aToken = hash.access_token;

    
        if (aToken) {
          // Set token
          localStorage.setItem('token', aToken);
          this.setState({
            token: aToken,
          });

          spotifyApi.setAccessToken(aToken);
          localStorage.setItem('spotifyApi', JSON.stringify(spotifyApi));

          var alltracks = [];
              var dd = new Date();
          loop(1, [], aToken).then((res) => {
              res.push(this.state.item);
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
                            localStorage.setItem('item', JSON.stringify(data.body));
                        this.setState({
                            item: data.body,
                            is_playing: data.is_playing,
                            progress_ms: data.progress_ms,
                            no_data: false /* We need to "reset" the boolean, in case the
                          user does not give F5 and has opened his Spotify. */
                          });          
                          isFirstSongOfToday = false;                         
                        } 
                          todaysSongsList.push(data.body);
                        });
                }
            }                       
            });
        }
        if (this.state.isSignedIn) {this.timer = setInterval(()=> this.getItems(), 10000);}
    }
    
    componentDidUpdate() {
        if(!this.state.isSignedIn){localStorage.setItem( 'isSignedIn', true );this.setState({isSignedIn: true});}

        if(this.state.isThereANewEntry) {

            loop(1, ['a'], this.state.token).then((res) => {

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
                          localStorage.setItem('item', JSON.stringify(data.body));
                          this.setState({
                              item: data.body,
                              is_playing: data.is_playing,
                              progress_ms: data.progress_ms,
                              no_data: false /* We need to "reset" the boolean, in case the
                            user does not give F5 and has opened his Spotify. */
                            });          
                            isFirstSongOfToday = false;                         
                          } 
                            todaysSongsList.push(data.body);
                          });
                  }
              }                       
              });
              window.location.reload();
        }
    }
      componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
      }


    

      getItems() {
        spotifyApi.setAccessToken(this.state.token);
        localStorage.setItem('spotifyApi', JSON.stringify(spotifyApi));

        var alltracks = [];
            var dd = new Date();
        loop(1, [], this.state.token).then((res) => {
            res.push(this.state.item);
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
                          localStorage.setItem('item', JSON.stringify(data.body));
                      this.setState({
                          item: data.body,
                          is_playing: data.is_playing,
                          progress_ms: data.progress_ms,
                          no_data: false /* We need to "reset" the boolean, in case the
                        user does not give F5 and has opened his Spotify. */
                        });          
                        isFirstSongOfToday = false;                         
                      } 
                        todaysSongsList.push(data.body);
                      });
              }
          }                       
          });
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
            localStorage.setItem('item', JSON.stringify(data.item));
            this.setState({
              item: data.item,
              is_playing: data.is_playing,
              progress_ms: data.progress_ms,
              no_data: false 
            });
          }
        });
      }

      

    render() {
    
  return (
    <div className="App">

        <Switch>
            <Route exact path="/journal">      {this.state.isSignedIn && (<div>    <button className="buttons2" style={{color:"white", backgroundColor:"#008CBA", position:"relative", marginBottom:"10px"}}><Link style={{color:"white", textDecoration:"none"}} to="/">Add Journal Entry</Link></button>
            <h1>Life Artifacts</h1>
            <Search/>
            <JournalEntriesList spotifyApi={this.state.spotifyApi}  token={this.state.token} isThereANewEntry={this.state.isThereANewEntry}/></div>)}</Route>
            <Route path="/"> <div>                 <img src={logo} className="App-log" alt="log"/>
                  <div className="heaing" style={{padding:"0px", margin:"0px", border:"0"}}><h1>Music Journal</h1></div>
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
          <div className="Main" style={{display:"flex"}}>
          {this.state.token && !this.state.no_data && (
            <Player
              item={this.state.item}
              is_playing={this.state.is_playing}
              progress_ms={this.state.progress_ms}
            />
          )}
          {this.state.no_data && (
            <h6>
              Have you liked a song today? Make sure it's saved on spotify!
            </h6>
          )}

      {this.state.isSignedIn && (<Form
        spotifyApi={this.state.spotifyApi}
        item={this.state.item}
        updateOnNewEntry={this.updateOnNewEntry}
        token={this.state.token}
        getPlaying={this.getPlaying}/>)}
        </div>

{this.state.isSignedIn && (<button className="buttons" style={{backgroundColor:"#008CBA", position:"relative", left:"35%", top:"0", transform:"scale(1.4)"}} ><Link style={{color:"white", textDecoration:"none"}}  to="/journal">journal</Link></button>)}
<button className="buttons2" style={{color:"white", backgroundColor:"#f44336", position:"relative", left:"37%", marginBottom:"10px"}}>Sign out</button>
      </div></Route>
        </Switch>
    </div>
          
  );
          }
}


