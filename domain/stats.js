'use strict';

module.exports = (errors, publicApi, dataMinding) => {
  return {
    getContactsPerHour: (clientName, indicators, from, to, channel, resource, resource_id, granularity) => {

      const promises = [
        dataMinding.getClientWebsitesFromName('ha', clientName),
        dataMinding.getClientWebsitesFromName('sd', clientName)
      ];

      return when.settle(promises)
      .spread((ha, sd) => {
        if (ha.state === 'fulfilled') {
          return {
            platform: 'ha',
            client: ha.value
          }
        }
        if (sd.state === 'fulfilled') {
          return {
            platform: 'sd',
            client: sd.value
          }
        }
        return when.reject(new errors.ClientNotFoundError(
          'domain/stats/getContactsPerHour',
          'The client ' + clientName + ' is not found on both platforms'
        ));
      })
      .then((result) => {
        const platform = result.platform;
        const websites = result.client.websites;

        return publicApi.getStatistic(
          platform, websites, channel, resource, resource_id, indicators, from, to, granularity
        ).then((data) => {
          return _.merge(result, {data});
        });
      });
    }
  };
};
