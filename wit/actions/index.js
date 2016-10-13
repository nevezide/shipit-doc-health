'use strict';

module.exports = (domain) => {
  const stats = require('./stats')(domain.stats);

  return _.merge({}, stats);
};
