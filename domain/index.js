'use strict';

module.exports = (resources) => {
  return {
    stats: require('./stats')(resources.publicApi)
  };
};
