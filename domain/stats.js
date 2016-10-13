'use strict';

module.exports = (publicApi) => {
  return {
    getContactsPerHour: (clientName, indicators, from, to, channel, resource, resource_id, granularity) => {
      const platform = 'ha', website_list='3';

      // TODO get website_list from client name (on each platform)
      return publicApi.getStatistic(
        platform, website_list, channel, resource, resource_id, indicators, from, to, granularity
      );
    }
  };
};
