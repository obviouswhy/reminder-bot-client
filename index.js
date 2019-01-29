
const line = require('@line/bot-sdk');
var express = require("express");
var bodyParser = require("body-parser");
const request = require('request');

//Url that will receive the reminder message to send as a push message
const urlPushMessages = 'https://immense-garden-31721.herokuapp.com/pushMessage'
// initialize the token and the channelSecret for the API of LINE
const defaultAccessToken = 'xxxxxxxxxxxxxxxxxxxxxxxx';
const defaultSecret = 'xxxxxxxxxxxxxxxxxxxxxx';
// create LINE SDK config from env variables
const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || defaultAccessToken,
  channelSecret: process.env.CHANNEL_SECRET || defaultSecret,
};

// create the express app
var app = express();

// make the app listen through the port given by Heroku
const port = process.env.PORT;
app.listen(port, function() {
  console.log(`the app is now listening on ${port}`);
});

// create LINE client
const client = new line.Client(config);

// using a GET request, display 'Up and Running' to know if the server has deployed correctly
app.get('/', function(req, res){
  res.send('Up and Running!');
});

// create a webhook for the API and calls LINE middleware (that way it parses the body and checks the signature validation automatically)
app.post('/webhook', line.middleware(config), function(req, res){

  //if there's no body in the request return error
  if (!req.body) return res.sendStatus(400);
  //save all the events in the variable events && for every event check what kind of type it is (depending on the type will do one thing or another)
  var events = req.body.events
  events.forEach(function(event){
    console.log(event);
    switch (event.type) {
      case 'message':
        // if it's a text message check the first 4 characters of the text (to identify what kind of command it is)
        switch (event.message.type) {
          case 'text':
            var msg = event.message.text  //message received from LINE
            var mes //message that is gonna be replied
              switch (msg.substring(0,4)) {
                // if it starts with '/rem' it means it's a reminder
                case '/rem':
                    console.log('This is a Reminder');
                    var remMsg = msg.substring(5)
                    console.log(remMsg);
                     // calls the function to send the reminder to the server and sets up the response acording to the response of the server
                    var prom = sendReminder(remMsg, event.source.userId, event.timestamp)
                    prom.then(function(result){
                      res.sendStatus(200)
                      mes = { type: 'text', text: "The reminder was successfully setted up, see you in a bit!"}
                      client.replyMessage(event.replyToken, mes)
                      return result;
                    })
                    .catch(function(error){
                      res.sendStatus(400)
                      mes = { type: 'text', text: "I'm sorry to inform you that it wasn't possible to set up the reminder"}
                      client.replyMessage(event.replyToken, mes)
                      return error;
                    });
                    break;
                // if its none of the previous just display the text in the log
                default:
                  if (event.source.userId ='U1bb2981cf7a83fc39293353d3ea75e80') {
                    console.log('Hello Sergi, this message is for you (from you): \n'+msg);
                  }else {
                    console.log(msg);
                  }
                  res.sendStatus(200)
              }
              break;
            case 'sticker':
              console.log("that's a nice sticker dude!");
              break;
          default:
            console.log("That's not a sticker or a text message");
        }
        break;
      default:
        res.sendStatus(200)
      }
  });
});

// this has to be after the middleware, if not the middleware cannot access to the raw body of the request
app.use(bodyParser.json());
// sends a push message when a POST request is made to this address. (sends it to the userID specified and sends the message specified)
app.post('/pushMessage', function(req, res){
  console.log(req.body);
  const mes = { type: 'text', text: "Your reminder is here: \n'"+req.body.message+"'" };
  client.pushMessage(req.body.userID, mes);
  res.sendStatus(200);
});

// sends the reminder to the server
  // gonna have to send the userId too to send the reminder
function sendReminder(reminderMessage, userId, timestamp){
  var options = {
    uri: 'https://dry-plains-88553.herokuapp.com/reminders',
    method: 'POST',
    json: true,
    body: {
      webhook: urlPushMessages,
      userID: userId,
      timeStamp: timestamp,
      message: reminderMessage
    }
  };

  var promise = new Promise(function (resolve, reject) {
    request(options, function (error, response, body) {
      if (!error) {
        console.log('Response from server - '+response.body);
        resolve ("OK");
      }else {
        console.log('Error from the server - \n' + error);
        reject ("ERROR");
      }
    })
  });
  return promise;
};
