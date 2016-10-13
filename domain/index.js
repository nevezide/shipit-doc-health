'use strict';

module.exports = (errors, resources) => {
  return {
    stats: require('./stats')(errors, resources.publicApi, resources.dataMinding)
  };
};
