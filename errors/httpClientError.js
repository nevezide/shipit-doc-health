'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when an http request fails
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function HttpClientError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'HttpClientError';
  }

  HttpClientError.prototype = Object.create(DefaultError.prototype);

  return HttpClientError;
};
