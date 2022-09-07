'use strict';
var { Client, LogLevel } = require('hazelcast-client');

function createClientConfig() {
  const lifecycleListener = (state) => {
    // console.log('Lifecycle Event >>> ' + state);
  };

  return {
    clusterName: 'dev',
    network: {
      connectionTimeout: 6000,
      clusterMembers: ['127.0.0.1:5701'],
    },
    logging: {
      level: LogLevel.INFO,
    },
    lifecycleListeners: [lifecycleListener],
    connectionStrategy: {
      asyncStart: false,
      reconnectMode: 'ASYNC',
      connectionRetry: {
        initialBackoffMillis: 100000,
        maxBackoffMillis: 60000,
        multiplier: 2,
        clusterConnectTimeoutMillis: 1,
        jitter: 0.2,
      },
    },
  };
}

const hazelCast = async () => {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

  if (isVercel) {
    return { hzErrorConnection: true, hz: null };
  } else {
    try {
      // Connect to Hazelcast cluster
      const client = await Client.newHazelcastClient(createClientConfig());
      // Print some information about this client
      return { hzErrorConnection: false, hz: client };
    } catch (err) {
      return { hzErrorConnection: true, hz: null };
    }
  }
};

export default hazelCast;
