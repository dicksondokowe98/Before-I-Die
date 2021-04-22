
import React, { useState } from 'react';
import firebase from '../util/firebase';
import '../App.css';
import ReactGA from 'react-ga';

var pageViewRef = firebase.database().ref('pageViews');
var db = firebase.database();
var hasBeenLoaded = false



export default function PageViewCounter() {
    const [pageViewCount, setpageViewCount] = useState(0);    

      const creatAndUpdatePageViews = () => {
          if (hasBeenLoaded) {
              
          }
          else {
        pageViewRef
        .child('count')
        .transaction(function(currentNumberOfViews) {
            return (currentNumberOfViews || 0) + 1;
          });
    
        pageViewRef.child('count').on('value', (snapshot) => {
                //when the transation is made to increment the count firebase seems to temporary consider the increment(1) as the current visitor count value
                if(snapshot.val() > 1)
                setpageViewCount(snapshot.val());
          });
      hasBeenLoaded = true;
      }
    };
    return (
        <div style={{position:'relative', bottom:'0', left:'10', width:'100%', position:'fixed', textAlign:'left'}}>
            {/* <h6>{creatAndUpdatePageViews()}visits: {pageViewCount}</h6> */}
        </div>
    );
}

