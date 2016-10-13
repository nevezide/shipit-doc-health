'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when a session is not found
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function SessionNotFoundError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'SessionNotFoundError';
  }

  SessionNotFoundError.prototype = Object.create(DefaultError.prototype);

  return SessionNotFoundError;
};
