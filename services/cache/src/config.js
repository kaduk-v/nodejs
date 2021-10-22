module.exports = {
    port: process.env.CACHE_PORT || 4000,
    host: '0.0.0.0',
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://rabbitmq',
        rpc_queue: 'rpc_cache'
    }
};
