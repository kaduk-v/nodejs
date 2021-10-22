const rpcServer = require('./src/RpcServer');
const app = require('fastify')({ logger: true });
const config = require("./src/config");
const storage = require("./src/Storage");

// init RPC server
(async () => {
    await rpcServer.init();
})();

app.post('/add', (request, reply) => {
    const { key, data } = request.body;

    storage.set(key, data);

    reply.code(201).send({status: 'Ok'});
});

// run the http server
(async () => {
    try {
        await app.listen(config.port, config.host);
    } catch (err) {
        app.log.error(err);
        process.exit(1);
    }
})();
