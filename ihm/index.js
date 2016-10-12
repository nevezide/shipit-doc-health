'use strict';

var SOCKET_URL = 'http://localhost';
var SOCKET_PORT = 3000;

function SocketManager (logger) {
  this.socket = io(SOCKET_URL + ':' + SOCKET_PORT);

  this.socket.on('connect', function () {
    logger.info('Connected on port ' + SOCKET_PORT);
  });

  return {
    sendMessage: function (message) {
      this.socket.send(message);
    }.bind(this),
    addReceivedMessageHandler: function (handler) {
      this.socket.on('message', handler);
    }.bind(this)
  }
};

/* Dynamic IHM actions */

var buildMessage = function (from, message) {
  $('.messages').append(
    '<div class="pseudo" data-from="' + from + '">' + from + '</div>' +
    '<div class="message" data-from="' + from + '">' + message + '</div>'
  );
};

/* Entry point */

$(document).ready(function () {
  var sessionId;
  var socketManager = new SocketManager(console);

  socketManager.addReceivedMessageHandler(function (data) {
    sessionId = data.sessionId;
    buildMessage('bot', data.message);
  });

  // When the visitor send a message
  $('.send').on('click', function () {
    var message = $('input[name="visitor"]').val();
    buildMessage('visitor', message);
    socketManager.sendMessage({
      sessionId: sessionId,
      message: message
    });
  }.bind(this));
});
