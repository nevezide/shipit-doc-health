'use strict';

module.exports = (uuid, errors) => {
  this.sessionsPool = {};

  var createSession = () => {
    return when.promise((resolve) => {
      const sessionIdentifier = uuid.v1();
      const newSession = {
        id: sessionIdentifier
      };
      this.sessionsPool[sessionIdentifier] = newSession;
      return resolve(newSession);
    });
  };

  var getSession = (sessionId) => {
    return when.promise((resolve, reject) => {
      let session = this.sessionsPool[sessionId];
      if (_.isEmpty(session)) {
        return reject(new errors.SessionNotFoundError('session/setSession', 'Unknown session ' + sessionId));
      }
      return resolve(session);
    });
  };

  var setSession = (sessionId, attribute, value) => {
    return when.promise((resolve, reject) => {
      let session = this.sessionsPool[sessionId];
      if (_.isEmpty(session)) {
        return reject(new errors.SessionNotFoundError('session/setSession', 'Unknown session ' + sessionId));
      }
      session[attribute] = value;
      return resolve(session);
    });
  };

  return {
    createSession,
    getSession,
    setSession
  };
};
