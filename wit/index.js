'use strict';

module.exports = (config, errors, domain, logger) => {
  const wit = require('node-wit');
  const actions = require('./actions')(logger, domain);
  actions.send = (req, res) => {
    logger.error(new errors.WitClientError('wit', 'Missing receivedMessageHandler'));
  };

  const client = new wit.Wit({accessToken: config.token, actions});
  return {
    client,
    addReceivedMessageHandler: (handler) => {
      actions.send = handler;
    }
  };
};
