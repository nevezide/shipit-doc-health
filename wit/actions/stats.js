'use strict';

module.exports = (statsDomain) => {

  const getEntity = (entities, entity) => {
    const val = entities && entities[entity] &&
        Array.isArray(entities[entity]) &&
        entities[entity].length > 0 &&
        entities[entity][0].value
      ;
    if (!val) {
      return null;
    }
    return typeof val === 'object' ? val.value : val;
  };

  return {
    getContactsPerHour: ({context, entities}) => {
      return when(entities)
        .then((entities) => {
          const params = {
            clientName: getEntity(entities, 'clientName'),
            indicators: getEntity(entities, 'indicators'),
            datetime: getEntity(entities, 'datetime'),
            from: getEntity(entities, 'from'),
            to: getEntity(entities, 'to'),
            channel: getEntity(entities, 'channel'),
            resource: getEntity(entities, 'resource'),
            resource_id: getEntity(entities, 'resource_id'),
            granularity: getEntity(entities, 'granularity')
          };

          if (_.isEmpty(params.clientName)) {
            context.missingClientName = true;
            return when.resolve(context);
          }
          if (_.isEmpty(params.indicators)) {
            context.missingIndicators = true;
            return when.resolve(context);
          }
          if (!(_.isEmpty(params.datetime) || (_.isEmpty(params.from) && _.isEmpty(params.to)))) {
            context.missingPeriod = true;
            return when.resolve(context);
          }
          if (!_.isEmpty(params.datetime)) {
            params.from = params.datetime;
            params.to = params.datetime;
            delete params.datetime;
          }

          params.from = _.truncate(params.from, {
            length: 10,
            omission: ''
          });

          params.to = _.truncate(params.to, {
            length: 10,
            omission: ''
          });

          params.indicators = _.snakeCase(params.indicators);

          return when(_.values(params))
            .spread(statsDomain.getContactsPerHour)
            .then((data) => {
              const output = {
                data: _.round(_.values(data)[0], 2)
              };
              params.indicators = _.lowerCase(params.indicators);

              return _.merge(context, params, output);
            });
        })
        .catch((error) => {
          return {error};
        });
    }
  };
};
