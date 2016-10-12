'use strict';

module.exports = (uuid) => {
  this.sessionsPool = {};

  var createSession = () => {
    const sessionIdentifier = uuid.v1();
    const newSession = {
      id: sessionIdentifier,
      context: {}
    };
    this.sessionsPool[sessionIdentifier] = newSession;
    return newSession;
  };

  var getSession = (sessionId) => {
    return this.sessionsPool[sessionId];
  };

  var setSession = (sessionId, context) => {
    let session = this.sessionsPool[sessionId] || {};
    session.id = sessionId;
    session.context = context;
    return session;
  };

  var getOrCreateSession = (sessionId) => {
    var session = getSession(sessionId);
    if (_.isEmpty(session)) {
      session = createSession();
    }
    return session;
  };

  return {
    getOrCreateSession,
    setSession
  };
};
