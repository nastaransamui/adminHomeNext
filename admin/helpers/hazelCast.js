'use strict';
var { Client } = require('hazelcast-client');

function createClientConfig() {
  const lifecycleListener = (state) => {
    console.log('Lifecycle Event >>> ' + state);
  };

  return {
    clusterName: 'dev',
    network: {
      connectionTimeout: 6000,
      clusterMembers: ['127.0.0.1:5701'],
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

      await client.shutdown();
    } catch (err) {
      return { hzErrorConnection: true, hz: null };
    }
  }

  // if (!isVercel) {
  //   try {
  //     await Client.newHazelcastClient(createClientConfig())
  //       .then((err, res) => {
  //         console.log(err);
  //         console.log(res);
  //         return { hzErrorConnection: true, hz: null };
  //       })
  //       .catch((error) => {
  //         console.log('40');
  //         console.log(error);
  //         return { hzErrorConnection: true, hz: null };
  //       })
  //       .finally((hz) => {
  //         console.log('finall');
  //         console.log(hz);
  //         return { hzErrorConnection: true, hz: null };
  //       });
  //   } catch (error) {
  //     console.log('sende');
  //   }
  // } else {
  //   return { hzErrorConnection: true, hz: null };
  // }
  // try {
  //   if (!isVercel) {
  //     const hz = await Client.newHazelcastClient(createClientConfig());
  //     console.log(typeof hz);
  //     return { hzErrorConnection: true, hz: hz };
  //   } else {
  //     return { hzErrorConnection: false, hz: null };
  //   }
  // } catch (error) {
  //   return { hzErrorConnection: true, hz: null };
  // }
};

export default hazelCast;
