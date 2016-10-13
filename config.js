
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
        host: 'http://ha.iadvize.com/api/2',
        key: 'b4960503a73158fe5eeb20872d769a6f'
      },
      sd: {
        host: 'http://www.iadvize.com/api/2',
        key: '595562f2a1c3e3773a93a32601b3c339'
      }
    }
  }
};
