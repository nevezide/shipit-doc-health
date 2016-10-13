
module.exports = {
  app: {
    port: process.env.APP_PORT
  },
  socket: {
    port: process.env.SOCKET_PORT
  },
  wit : {
    token: process.env.WIT_AI_TOKEN
  },
  resources: {
    publicApi: {
      ha: {
        host: process.env.PUBLICAPI_HA_HOST,
        key: process.env.PUBLICAPI_HA_KEY
      },
      sd: {
        host: process.env.PUBLICAPI_SD_HOST,
        key: process.env.PUBLICAPI_SD_KEY
      }
    }
  }
};
