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

  const parseEntities = (schema, entities) => {
    const outputParams = {};
    const missingParams = {};

    _.map(_.keys(schema), (entityName) => {
      const entityValue = getEntity(entities, entityName);
      if (_.isEmpty(entityValue) && schema[entityName].required) {
        missingParams['missing' + _.upperFirst(entityName)] = true;
        return;
      }
      outputParams[entityName] = entityValue;
    });

    if(_.isEmpty(missingParams)) {
      return when.resolve(outputParams);
    }

    return when.reject(missingParams);
  };

  return {
    getContactsPerHour({context, entities}) {
      const schema = {
        clientName: {
          required: true
        },
        channel: {
          required: false
        },
        resource: {
          required: false
        },
        resource_id: {
          required: false
        },
        indicators: {
          required: true
        },
        datetime: {
          required: false
        },
        from: {
          required: false
        },
        to: {
          required: false
        },
        granularity: {
          required: false
        }
      };

      /*
       channel='chat', resource='operator';
       const resource_id='3133', indicators='contact_per_hour_number', from='2016-10-01';
       const to='2016-10-11', granularity='day';
       */

      //Parse entities
      return parseEntities(schema, entities)
      .then((params) => {
        if (!(_.isEmpty(params.datetime) || (_.isEmpty(params.from) && _.isEmpty(params.to)))) {
          return when.reject({
            missingPeriod: true
          });
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

        return _.values(params);
      })
      .catch((missing) => {
        return missing;
      })
      .spread(statsDomain.getContactsPerHour)
      .then((data) => {
        console.log(data);
        context.data = _.values(data)[0];
        return context;
      });
    }
  };
};
