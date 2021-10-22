const rpcServer = require('./src/RpcServer');

// init RPC server
(async () => {
    await rpcServer.init();
})();

