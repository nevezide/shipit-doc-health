'use strict';

const SOCKET_PORT = 3000;
const WIT_SERVER_ACCESS_TOKEN = 'IX3MEX6BDY6MD653ZP2YG3ULALENYAAR';

var _ = require('lodash');
var uuid = require ('uuid');

/* Session manager */
var sessions = {};

var getOrCreateSession = function (sessionId) {
  var session = sessions[sessionId];
  if (_.isEmpty(session)) {
    var sessionIdentifier = uuid.v1();
    session = {
      id: sessionIdentifier,
      context: {}
    };
    sessions[sessionIdentifier] = session;
  }
  return session;
};

var setSession = function (sessionId, context) {
  var session = sessions[sessionId];
  if (_.isEmpty(session)) {
    session = {};
  }
  session.context = context;
  return session;
};

var currentSocket;

/* Wit init */

let Wit = null;
let interactive = null;
try {
  // if running from repo
  Wit = require('../').Wit;
  interactive = require('../').interactive;
} catch (e) {
  Wit = require('node-wit').Wit;
  interactive = require('node-wit').interactive;
}

/* Wit actions */

const actions = {
  send(request, response) {
    const {sessionId, context, entities} = request;
    const {text, quickreplies} = response;
    return new Promise(function(resolve, reject) {
      console.log('request');
      console.log(request);
      console.log(response);
      currentSocket.send({
        sessionId: request.sessionId,
        message: response.text
      });
      return resolve();
    });
  },
  getContactsPerHour({context, entities}) {
    return new Promise(function(resolve, reject) {
      if (_.isEmpty(entities)) {
        context.missingClientId = true;
        return resolve(context);
      }

      context.clientId = entities.clientId[0].value;
      context.clientName = 'Maty';
      context.period = entities.datetime[0].value;
      context.contacts = 45;

      return resolve(context);
    });
  }
};

/*
const client = new Wit({accessToken, actions});
interactive(client);
*/

/* Socket init */

var io = require('socket.io')(SOCKET_PORT);
/*
io.on('connection', function (socket) {
  socket.send('Bonjour cher visiteur');
  socket.on('message', function (msg) { console.log('Received message: ' + msg);});
  socket.on('disconnect', function () { console.log('disconnected !') });
});
*/

const client = new Wit({accessToken: WIT_SERVER_ACCESS_TOKEN, actions});

io.on('connection', function (socket) {
  currentSocket = socket;

  console.log('Socket connected on port ' + SOCKET_PORT);

  socket.on('message', function (data) {
    console.log('Received message: ' + data.message);

    var session = getOrCreateSession(data.sessionId);
console.log('got message with session id ' + data.sessionId);
    console.log('local sessionId ' + session.id);
    // Let's forward the message to the Wit.ai Bot Engine
    // This will run all actions until our bot has nothing left to do
    client.runActions(
      session.id, // the user's current session
      data.message, // the user's message
      session.context
    ).then((context) => {
      // Our bot did everything it has to do.
      // Now it's waiting for further messages to proceed.
      console.log('Waiting for next user messages');
      // Updating the user's current session state
      //sessions[sessionId].context = context;
      setSession(session.id, context)
    })
    .catch((err) => {
      console.error('Oops! Got an error from Wit: ', err.stack || err);
    });
  });
  socket.on('disconnect', function () { console.log('disconnected !') });
});
