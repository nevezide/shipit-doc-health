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
    if (_.isEmpty(platform) || _.isEmpty(config[platform])) {
      return when.reject(
        new errors.HttpClientError(
          'PublicApi/get',
          'Missing or bad platform parameter'
        )
      );
    }

    options.url = config[platform].host + options.path;
    options.method = 'GET';
    options.json = true;
    options.headers = options.headers || {};
    options.headers['X-API-Key'] = config[platform].key;

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
    return when({website_list, channel, resource, resource_id, indicators, from, to, granularity})
    .then((filters) => {
      return _.omitBy(filters, _.isEmpty);
    })
    .then((filters) => {
      return get(platform, {
        path: '/statistic',
        qs: {
          filters
        }
      });
    });
  };

  return {
    getStatistic
  };
};
