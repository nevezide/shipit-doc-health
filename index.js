'use strict';

require('./bootstrap');

const config = {
  port: 3001,
};

const uuid = require ('uuid');
const sessionManager = require('./managers/session')(uuid);
const socketManager = require('./managers/socket')(console);
const domain = require('./domain');
const wit = require('./wit')(config, domain, console);

socketManager.connect(config.port)
  .then((socket) => {
    // When the bot responds to the visitor
    wit.addReceivedMessageHandler((request, response) => {
      return when.promise(function(resolve) {
        socket.sendMessage({
          sessionId: request.sessionId,
          message: response.text
        });
        return resolve();
      });
    });
    // When the visitor send a message to the bot
    socket.addReceivedMessageHandler((data) => {
      var session = sessionManager.getOrCreateSession(data.sessionId);
      wit.client.runActions(
        session.id, // the user's current session
        data.message, // the user's message
        session.context
      )
      .then((context) => {
        sessionManager.setSession(session.id, context);
      })
      .catch((err) => {
        console.error('Oops! Got an error from Wit: ', err.stack || err);
      });
    });
  });


// Tout d'abbord on initialise notre application avec le framework Express
// et la bibliothèque http integrée à node.
var express = require('express');
var app = express();
var http = require('http').Server(app);

// On gère les requêtes HTTP des utilisateurs en leur renvoyant les fichiers du dossier 'public'
app.use("/", express.static(__dirname + "/ihm"));

// On lance le serveur en écoutant les connexions arrivant sur le port 3000
http.listen(3000, function(){
  console.log('Server is listening on *:3000');
});
