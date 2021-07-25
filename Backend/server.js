var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var helper = require('sendgrid').mail;

require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});

const axios = require("axios");
const fireapp = require('./firebase');
const db = fireapp.db;
const firebase = require("firebase");
const { PubSub } = require("@google-cloud/pubsub");

const geofire = require('geofire-common');

// Imports the Google Cloud client library. v1 is for the lower level
// proto access.
const {v1} = require('@google-cloud/pubsub');

// Creates a client; cache this for further use.
const subClient = new v1.SubscriberClient();

const formattedSubscription = subClient.subscriptionPath(
    'long-base-311903',
    'request_sent-sub'
  );


var cors = require('cors');
const { error } = require('console');

  
var app = express();


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors()) 






const sgMail = require('@sendgrid/mail')
sgMail.setApiKey('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')


var docEmails =[];

responseGet=(requestID) =>{


    var doctorID =[];

    
      
      
    async function getDocData(collectionName, docName) {
        try {
            let doc = await db.collection(collectionName).doc(docName).get();
            if (doc.exists) 
            {
                console.log(doc.data());
                return doc.data();
            }
            else{
                console.log("No such document");
            }
            
        } catch(error) {
            console.log("ERROR",error);
            process.exit();
        }
      }
      
      async function updateRequest(doctorID){
      
      for (const id of doctorID) {
        await db.collection('doctors').doc(id).update({
          requestids: firebase.firestore.FieldValue.arrayUnion(requestID)
        });
      }
      
      }
      
      
      function queryHashes(lat,lng) {
        // [START fs_geo_query_hashes]
        // Find cities within 50km of London
        const center = [lat, lng];
        const radiusInM = 10 * 1000;
      
        // Each item in 'bounds' represents a startAt/endAt pair. We have to issue
        // a separate query for each pair. There can be up to 9 pairs of bounds
        // depending on overlap, but in most cases there are 4.
        const bounds = geofire.geohashQueryBounds(center, radiusInM);
        const promises = [];
        for (const b of bounds) {
          const q = db.collection('doctors')
            .orderBy('hash')
            .startAt(b[0])
            .endAt(b[1]);
      
          promises.push(q.get());
        }
      
        // Collect all the query results together into a single list
        Promise.all(promises).then((snapshots) => {
          //const matchingDocs = {};
      
          for (const snap of snapshots) {
            for (const doc of snap.docs) {
              const lat = doc.get('lat');
              const lng = doc.get('lng');
      
              // We have to filter out a few false positives due to GeoHash
              // accuracy, but most will match
              const distanceInKm = geofire.distanceBetween([lat, lng], center);
              const distanceInM = distanceInKm * 1000;
              if (distanceInM <= radiusInM) {
                //matchingDocs[doc.id].push(doc.data());
                doctorID.push(doc.id);
                docEmails.push(doc.data().email)
              }
            }
          }
          return doctorID;
        }).then((matchingDocs)=>{
          doctorData = matchingDocs;
          console.log(doctorData);
          updateRequest(doctorData).then(()=>{
      
            console.log("done")
            // batchSend(docEmails);

            const msg = {
                to: ['aishwaryat2@gmail.com','ntallapr@gmail.com','chvineeth.2@gmail.com'], // Change to your recipient
                from: 'kallakurinagasai@gmail.com', // Change to your verified sender
                subject: 'New request available',
                text: 'Please login to view request',
                html: '<strong>Please login to view the new request</strong>',
              }

            sgMail
            .send(msg)
            .then(() => {
              console.log('Email sent')
            })
            .catch((error) => {
              console.error(error)
              })

          })
          
      
        })
      
      }
      
      
    var collectionName = 'requests'
  
    if (requestID){

        console.log("the request ID being searched is",requestID);

        getDocData(collectionName,requestID).then((docData)=>{
  
            lat = docData.lat;
            lng = docData.lng;
        
            doctorData = queryHashes(lat,lng)
          })
    }
    

}



app.use('/',function(request, response) {

    if(request){

    console.log("request sent is" ,request)

    console.log("request.body.data.tostring is", request.body.data.toString())

    responseGet(request.body.data.toString());

    

    response.send(request.body.data);   

    }
    else{
        console.log(err)
    }

});


// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 5000;
app.listen(PORT, (res,err) => {
    
  console.log(`Server listening on port ${PORT}...`);
});
// [END app]

module.exports = app;
