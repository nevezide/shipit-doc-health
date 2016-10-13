'use strict';

module.exports = function(config, errors, logger, mysql) {
  var get = (platform, query) => {
    return when.promise((resolve, reject) => {
      if (_.isEmpty(platform) || _.isEmpty(config[platform])) {
        return reject(
          new errors.DataMindingError(
            'DataMinding/get',
            'Missing or bad platform parameter'
          )
        );
      }
      const connection = mysql.createConnection(config[platform]);
      connection.connect(function(error) {
        if (error) {
          return reject(
            new errors.DataMindingError(
              'DataMinding/get',
              'Error on data minding connection',
              error
            )
          );
        }
      });
      connection.query(query, (error, data) => {
        if (error) {
          return reject(
            new errors.DataMindingError(
              'DataMinding/get',
              'Error on data minding query',
              {
                query,
                error
              }
            )
          );
        }

        return resolve(data);
      });
    });
  };

  var getClientWebsiteFromName = (platform, clientName) => {
    return get(
      platform,
      'select c.id, c.societe, GROUP_CONCAT(w.id) as websites' +
      '  from website w' +
      '       inner join client_websites cw on cw.website_id = w.id' +
      '       inner join clients c on cw.client_id = c.id' +
      '              and c.societe like \'%' + clientName + '%\''
    );
  };

  return {
    getClientWebsiteFromName
  };
};
