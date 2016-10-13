'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when an wit request fails
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function WitBadRequestError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'WitBadRequestError';
  }

  WitBadRequestError.prototype = Object.create(DefaultError.prototype);

  return WitBadRequestError;
};
