module.exports = {
    port: process.env.DB_PORT || 5000,
    host: '0.0.0.0',
    rabbitmq: {
        url: process.env.RABBITMQ_URL || 'amqp://rabbitmq',
        rpc_queue: 'rpc_database'
    },
    mongo: {
        url: process.env.MONGO_URL || 'mongodb://mongodb:27017/',
        user: process.env.MONGO_USERNAME || '',
        password: process.env.MONGO_PASSWORD || '',
        database: process.env.MONGO_DEFAULT_DATABASE || 'mongo_db'
    }
};
