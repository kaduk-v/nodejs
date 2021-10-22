const RpcClient = require("../client/RpcClient");
const config = require("../config");
const http = require("http");

const cacheClient = new RpcClient(config.rabbitmq.rpc_queue.cache);
const dbClient = new RpcClient(config.rabbitmq.rpc_queue.db);

const userHandler = async (request, reply) => {
    const userId = request.params.id;

    const cache = await cacheClient.request({ key: userId });
    const cachedData = JSON.parse(cache);

    if (cachedData.data) {
        return reply.send(cachedData.data);
    }

    const result = await dbClient.request({ type: 'item', id: userId });

    addUserToCache({
        key: userId,
        data: result
    });

    reply.send(result);
};

const totalHandler = async (request, reply) => {
    const result = await dbClient.request({ type: 'totals' });

    reply.send(result)
};

const usersHandler =  async (request, reply) => {
    const page = request.query.page || 0;
    const limit = request.query.limit || 20;
    const data = {};

    if (request.query.country) {
        data.country = request.query.country;
    }

    if (request.query.city) {
        data.city = request.query.city;
    }

    const result = await dbClient.request({
        type: 'list',
        data,
        offset: {
            page,
            limit
        }
    });

    reply.send(result)
};

const addUserToCache = (data) => {
    const req = http.request({
        host: config.cache.host,
        port: config.cache.port,
        path: '/add',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }
    });

    req.write(JSON.stringify(data))
    req.end()
}

module.exports = (fastify, opts, done) => {
    fastify.get('/', usersHandler);
    fastify.get('/:id', userHandler);
    fastify.get('/totals', totalHandler);

    done();
}
