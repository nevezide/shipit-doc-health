'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when a problem occurs on wit client
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function WitClientError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'WitClientError';
  }

  WitClientError.prototype = Object.create(DefaultError.prototype);

  return WitClientError;
};
