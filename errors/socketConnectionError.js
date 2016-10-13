'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when a problem occurs on socket connection
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function SocketConnectionError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'SocketConnectionError';
  }

  SocketConnectionError.prototype = Object.create(DefaultError.prototype);

  return SocketConnectionError;
};
