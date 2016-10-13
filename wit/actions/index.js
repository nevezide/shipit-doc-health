'use strict';

module.exports = (domain) => {
  const stats = require('./stats')(domain);

  return _.merge({}, stats);
};
