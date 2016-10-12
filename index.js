'use strict';

require('./bootstrap');

const config = {
  port: 3000,
  token: 'IX3MEX6BDY6MD653ZP2YG3ULALENYAAR'
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
