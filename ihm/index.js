'use strict';

var SOCKET_URL = 'http://localhost';
var SOCKET_PORT = 3000;

$(document).ready(function () {
  var socket = io(SOCKET_URL + ':' + SOCKET_PORT);
  var sessionId;

  var buildMessage = function (from, message) {
    $('.messages').append('<div class="message" data-from="' + from + '">' + message + '</div>');
  };

  var sendAndBuildVisitorMessage = function (message) {
    buildMessage('visitor', message);
    socket.send({
      sessionId: sessionId,
      message: message
    });
  };

  socket.on('connect', function () {
    console.log('Connected on port ' + SOCKET_PORT);
    socket.on('message', function (data) {
      console.log('got session id ' + data.sessionId);
      sessionId = data.sessionId;
      buildMessage('bot', data.message);
    });
  });

  $('.send').on('click', function () {
    var message = $('input[name="visitor"]').val();
    sendAndBuildVisitorMessage(message);
  });
});
