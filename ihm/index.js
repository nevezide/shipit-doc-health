'use strict';

var SOCKET_URL = 'http://'+window.location.hostname;
var SOCKET_PORT = parseInt(window.location.port) + 1;

function SocketManager (logger) {
  this.socket = io(SOCKET_URL + ':' + SOCKET_PORT);

  this.socket.on('connect', function () {
    logger.info('Connected on port ' + SOCKET_PORT);
  });

  this.socket.on('connect_error', function () {
    logger.info('connected error ' + SOCKET_PORT);
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

var buildMessage = function (from, data) {
  const message = data.message;

  $('#chat-content .inner:first').append(
    '<div class="message">' +
      '<p class="inner ' + from + '">' +
         message +
      '</p>' +
    '</div>'
  );
};

$(document).ready(function () {
  var sessionId;
  var socketManager = new SocketManager(console);
  socketManager.addReceivedMessageHandler(function (data) {
    sessionId = data.sessionId;

    if (data.type === 'message') {
      buildMessage('bot', data);
    }
  });

  $("#chat-input input").keyup(function (event) {
    if(event.keyCode == 13){
      const message = $("#chat-input input").val();
      const data = {
        message: message,
        sessionId: sessionId
      };
      buildMessage('visitor', data);
      socketManager.sendMessage({
        sessionId: sessionId,
        message: message
      });
    }
  });
});

