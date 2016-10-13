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
var socketManager = new SocketManager(console);

var sendQuickResponse = (elmt, response, sessionId) => {
  socketManager.sendMessage({
    sessionId: sessionId,
    message: response
  });
  elmt.parent().addClass('active');
  $('.quickReply').remove();
  buildMessage('me', {
    message: response,
  });

};

/* Dynamic IHM actions */

var buildMessage = function (from, data) {

  const message = data.message;
  const quickReplies = data.quickReplies ? data.quickReplies : null;
  const sessionId = data.sessionId ? data.sessionId: null;

  $('.messages').append(
    '<div class="box_context ' + from +'">' +
      '<div class="box_message ' + from +'">' +
        '<div class="pseudo" data-from="' + from + '">' + from + '</div>' +
        '<div class="message" data-from="' + from + '">' + message + '</div>' +
      '</div>'
  );

  if (quickReplies) {
    $('.messages').append('<ul class="quickReplies">');
        quickReplies.forEach((value) => {
          $('.messages').append(
              '<li class="quickReply">' +
                  '<a href="javascript:void(0);" onclick="sendQuickResponse($(this),\'' + value + '\',\'' + sessionId + '\');">' +
              value +
              '</a>' +
              '</li>'
          );
        })
    $('.messages').append('</ul>');
  }

  $('.messages').append(
      '</div>'
  );

};

/* Entry point */

$(document).ready(function () {
  var sessionId;

  socketManager.addReceivedMessageHandler(function (data) {
    sessionId = data.sessionId;
    
    if (data.type === 'message') {
      buildMessage('Dr Bot', data);
    }
  });

  $("#message_box").keyup(function(event){
    if(event.keyCode == 13){
      $('.send').click();
    }
  });

  // When the visitor send a message
  $('.send').on('click', function () {
    var message = $('input[name="visitor"]').val();
    const data = {
      message: message,
      sessionId: sessionId
    }
    buildMessage('me', data);
    socketManager.sendMessage({
      sessionId: sessionId,
      message: message
    });
  }.bind(this));
});
