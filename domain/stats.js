'use strict';

module.exports = (errors, publicApi, dataMinding) => {
  return {
    getContactsPerHour: (clientName, indicators, from, to, channel, resource, resource_id, granularity) => {
      // TODO A extraire de la recherche du nom du client
      const platform = 'ha';

      return dataMinding.getClientWebsiteFromName(platform, clientName)
      .then((data) => {
        if (_.isEmpty(data) || _.isEmpty(data[0]) || _.isEmpty(data[0].websites)) {
          return when.reject(new errors.ClientNotFoundError(
            'domain/stats/getContactsPerHour',
            'The client ' + clientName + ' is not found'
          ));
        }
        return data[0].websites;
      })
      .then((websites) => {
        return publicApi.getStatistic(
          platform, websites, channel, resource, resource_id, indicators, from, to, granularity
        );
        //TODO Decorate with full client name with id in parenthesis
      });
    }
  };
};
