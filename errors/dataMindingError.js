'use strict';

module.exports = function(DefaultError) {
  /**
   * Error raised when an data minding query fails
   *
   * @param {string} action  - Functional action proceed when throw the error
   * @param {string} message - Error description
   * @param {object} context - Context data
   *
   * @constructor
   */
  function DataMindingError(action, message, context) {
    DefaultError.call(this, action, message, context);
    this.name = 'DataMindingError';
  }

  DataMindingError.prototype = Object.create(DefaultError.prototype);

  return DataMindingError;
};
