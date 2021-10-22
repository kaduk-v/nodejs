module.exports = {
    port: process.env.API_PORT || 3000,
    host: '0.0.0.0',
    cache: {
        port: process.env.CACHE_PORT || 4000,
        host: 'cache',
    },
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://rabbitmq',
        rpc_queue: {
            db: 'rpc_database',
            cache: 'rpc_cache'
        }
    }
};
