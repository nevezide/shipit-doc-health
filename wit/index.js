'use strict';

module.exports = (config, domain, logger) => {
  const wit = require('node-wit');
  const actions = require('./actions')(domain);
  actions.send = (req, res) => {
    logger.warn('No message reception handler provided');
  };
  
  const client = new wit.Wit({accessToken: config.token, actions});
  return {
    client,
    addReceivedMessageHandler: (handler) => {
      actions.send = handler;
    }
  };
};
