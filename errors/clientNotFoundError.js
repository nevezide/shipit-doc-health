'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when a client is not found
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function ClientNotFoundError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'ClientNotFoundError';
  }

  ClientNotFoundError.prototype = Object.create(DefaultError.prototype);

  return ClientNotFoundError;
};
