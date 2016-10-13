'use strict';

module.exports = (config, errors, logger) => {
  var httpClient = require('request-promise');

  return {
    publicApi: require('./publicApi')(config.publicApi, errors, logger, httpClient)
  };
};
