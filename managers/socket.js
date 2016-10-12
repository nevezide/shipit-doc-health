'use strict';

module.exports = (logger) => {

  const socketIo = require('socket.io');

  var connect = (port) => {
    return when.promise((resolve) => {
      socketIo(port).on('connection', (socket) => {
        logger.log('Socket connected on port ' + port);
        resolve(socket);
      });
    });
  };
  
  var exports = (socket) => {
    return {
      sendMessage: (message) => {
        socket.send(message);
      },
      addReceivedMessageHandler: (handler) => {
        socket.on('message', handler);
      }
    };
  };
  
  return {
    connect: (port) => {
      return connect(port)
      .then(exports);
    }
  };
};
