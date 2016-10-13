'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when no socket found in current session
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function SocketNotFoundError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'SocketNotFoundError';
  }

  SocketNotFoundError.prototype = Object.create(DefaultError.prototype);

  return SocketNotFoundError;
};
