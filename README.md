# reminder-bot-client
> This is a project with the objective of learning how the LINE API works.<br>
This project is made with nodejs.

This Project consists of 2 parts, the client side and the server side.

This is the Client Side which acts as an intermediary between the User and the Server.

To set a reminder, send a message to the bot starting with “/rem” which will let the client know the user wants to set a reminder. After that “in x seconds/minutes/hours” is expected, where “x” is a number. And finally followed by the message you want to be reminded of.

## Usage example

```sh
“/rem in 10 minutes take the medicine”
```
This will send you a reminder message saying: 
```sh
“Your reminder is here: 
' take the medicine'”
```

## How to set up a bot

refer to: _https://developers.line.biz/en/docs/messaging-api/building-bot/_

## Deploy to Heroku
refer to:
_https://devcenter.heroku.com/articles/git_

## Note

As this project had the purpose of knowing how the LINE API works, of the bot is still very limited and still contains bugs (specially in the error handling). 

## Current version is deployed in heroku

1. Client side (<https://immense-garden-31721.herokuapp.com/>)
2. Server side (<https://dry-plains-88553.herokuapp.com/>)
