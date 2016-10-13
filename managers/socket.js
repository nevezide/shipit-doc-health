'use strict';

module.exports = (config, errors, logger, sessionManager) => {

  const socketIo = require('socket.io');

  this.receivedMessageHandler = () => {
    logger.error(new errors.SocketConnectionError('socket', 'Missing receivedMessageHandler'));
  };

  var createConnection = (socket) => {
    return sessionManager.createSession()
    .then((session) => {
      sessionManager.setSession(session.id, 'socket', socket)
      .then(() => {
        socket.send({
          sessionId: session.id,
          type: 'connection.established'
        });
      })
      .then(() => {
        socket.on('message', this.receivedMessageHandler);
        logger.log('New connection ' + session.id + ' on port ' + config.port)
      });
    });
  };

  var sendMessage = (sessionId, message, quickReplies) => {
    return sessionManager.getSession(sessionId)
    .then((session) => {
      if (_.isEmpty(session.socket)) {
        return when.reject(
          new errors.SocketNotFoundError('socket/exports', 'No socket found in session ' + sessionId)
        );
      }
      session.socket.send({
        sessionId,
        type: 'message',
        message,
        quickReplies
      });
    });
  };

  return {
    create: () => {
      socketIo(config.port).on('connection', createConnection);
      logger.log('Socket listening on port ' + config.port);
      return when.resolve({
        sendMessage,
        addReceivedMessageHandler: (handler) => {
          this.receivedMessageHandler = handler;
        }
      });
    }
  };
};
