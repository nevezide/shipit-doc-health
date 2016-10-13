'use strict';

require('./bootstrap');

const config = require('./config');

const uuid = require ('uuid');
const errors = require('./errors')(console);
const sessionManager = require('./managers/session')(uuid, errors);
const socketManager = require('./managers/socket')(config.socket, errors, console, sessionManager);
const resources = require('./resources')(config.resources, errors, console);
const domain = require('./domain')(errors, resources);
const wit = require('./wit')(config.wit, errors, domain, console);

socketManager.create()
  .then((socket) => {
    // When the bot responds to the visitor
    wit.addReceivedMessageHandler((request, response) => {
      const {text, quickreplies} = response;
      return socket.sendMessage(request.sessionId, text, quickreplies);
    });
    // When the visitor send a message to the bot
    socket.addReceivedMessageHandler((data) => {
      return sessionManager.getSession(data.sessionId)
      .then((session) => {
        return wit.client.runActions(
          session.id, // the user's current session
          data.message, // the user's message
          session.context || {}
        )
        .catch((err) => {
          return when.reject(new errors.WitBadRequestError('index', 'Wit have a problem', err.stack || err));
        })
        .then((context) => {
          return sessionManager.setSession(session.id, 'context', context);
        });
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
http.listen(config.app.port, function(){
  console.log('IHM Server is listening on port ' + config.app.port);
});
