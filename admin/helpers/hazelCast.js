var Client = require('hazelcast-client').Client;

function createClientConfig() {
  const isVercel = process.env.NEXT_PUBLIC_SERVERLESS == 'true' ? true : false;

  const lifecycleListener = (state) => {
    console.log('Lifecycle Event >>> ' + state);
  };
  console.log(`isVercel: ${isVercel}`);
  if (!isVercel) {
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
}

const hazelCast = async () => {
  try {
    const hz = await Client.newHazelcastClient(createClientConfig());
    return { hzErrorConnection: false, hz: hz };
  } catch (error) {
    return { hzErrorConnection: true, hz: null };
  }
};

export default hazelCast;
