import React, {
    useState,
    useEffect
} from 'react';
import firebase from '../util/firebase';
import '../App.css';
import ReactGA from 'react-ga';
import Player from '../Player';
import {
    object
} from 'prop-types';




var aItem = null;
var i = 0;
var ana = function a(valude) {
    this.value = valude;
}
var aa = {};
aa = new ana(null);

var currentdate = new Date();
var datetime = "" + currentdate.getDate() + "/" +
    (currentdate.getMonth() + 1) + "/" +
    currentdate.getFullYear() + "@ " +
    currentdate.getHours() + ":" +
    currentdate.getMinutes() + ":" +
    currentdate.getSeconds();


ReactGA.initialize('UA-000000-01');
ReactGA.pageview(window.location.pathname + window.location.search);

export default function Todo({
    spotifyApi,
    token,
    todo
}) {

    const [aToken, setToken] = useState(token);
    //sort of bining value and setvalue usestaste initialsised to parapmeter
    const [aItem, setItem] = useState()

    useEffect(() => {
        if (i < 3) getSongSpotify(aa);

        setItem(aa.value)
    }, [aItem]);
    useEffect(() => {
        setToken(token)
    }, [token]);

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
    async function getSongSpotify(a) {
        i++;
        console.log("getsongspotifty called with spotifyApi: " + spotifyApi + "\n token: " + token + "\n a: " + a.value)

        //if the user has authorised
        if (spotifyApi && token && (a != null)) {
            spotifyApi.setAccessToken(token);
            try {
                if (todo.songId) {
                    console.log(todo.songId);
                    a.value =  await spotifyApi.getTrack(todo.songId).then(data => {
                        return data.body
                    });
                    setItem(a.value);

                    console.log("track data: " + a.value);
                }

            } catch (error) {
                console.log(error);

            }

        }

    }
    console.log("token: " + token + "\n aItem i.e song track used as a state: " + aItem)
    if(aItem == undefined) console.log("whattttttt the world how whyaijdfklsjflakjfsadklfjsadklfjsdklfasjdfklasdjfklasdjfksdaf undefined");
    return (
        <div className='entry'style={{width:'100%', position:'relative', boxSizing:'border-box', display:'flex'}} >
        { spotifyApi && token && aItem && (         <Player
              item={aItem}
              is_playing={false}
              progress_ms={0}
            />)}
        <div className='entryTitle'style={{width:'90%',float:'left', boxSizing:'border-box', overflowWrap: 'break-word'}} >
            <p className={todo.complete ? 'complete' : 'beforeIDieEntry'}>{todo.title}</p>
        </div>
        <div className='entryPlaceAndTime' style={{width:'9%',boxSizing:'border-box', float:'right', color:'grey'}}>
            <h6> {todo.city? todo.city + ', ' : todo.city} {todo.date}</h6>
        </div>
    </div>
                );
            }