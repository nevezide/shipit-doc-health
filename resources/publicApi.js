'use strict';

module.exports = function(config, errors, logger, httpClient) {

  var responseHandler = (response) => {
    if (response.meta.status === 'success') {
      return when.resolve(response.data);
    }

    if (response.meta) {
      return when.reject(
        new errors.HttpClientError(
          'PublicApi/responseHandler',
          'The target resource returns an error',
          response.meta.message
        )
      );
    }

    return when.reject(
      new errors.HttpClientError(
        'PublicApi/responseHandler',
        'Public API returns an error',
        response
      )
    );
  };

  var get = (platform, options) => {
    if (_.isEmpty(platform)) {
      return when.reject(
        new errors.HttpClientError(
          'PublicApi/getStatistic',
          'Missing platform parameter'
        )
      );
    }

    options.method = 'GET';
    options.json = true;
    options.headers = options.headers || {};
    options.headers['X-API-Key'] = config.key;

    return httpClient(options)
      .then(responseHandler)
      .catch((error) => {
        return when.reject(
          new errors.HttpClientError(
            'PublicApi/getStatistic',
            'An unknown error occurs',
            error
          )
        );
      });
  };

  var getStatistic = (platform, website_list, channel, resource, resource_id, indicators, from, to, granularity) => {

    const filters = {website_list, channel, resource, resource_id, indicators, from, to, granularity};

    return get(platform, {
      url: config.host + '/statistic',
      qs: {
        filters
      }
    });
  };

  return {
    getStatistic
  };
};
