'use strict';

module.exports = (domain) => {
  return {
    getContactsPerHour({context, entities}) {
      return when.promise(function(resolve, reject) {
        if (_.isEmpty(entities)) {
          context.missingClientId = true;
          return resolve(context);
        }

        context.clientId = entities.clientId[0].value;
        context.clientName = 'Maty';
        context.period = entities.datetime[0].value;
        context.contacts = 45;

        return resolve(context);
      });
    }
  };
};
