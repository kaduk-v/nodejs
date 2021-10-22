const amqp = require("amqplib");
const config = require("./config");
const mongoClient = require("./client/MongoDbClient");
const UserRepository = require("./repository/UserRepository");

class RpcServer {
    async #createChannel() {
        const connection = await amqp.connect(config.rabbitmq.url);

        return await connection.createChannel();
    }

    async init() {
        const channel = await this.#createChannel();
        await mongoClient.open();
        const userRepository = new UserRepository(mongoClient.client);

        const replyCb = async (msg) => {
            const request = JSON.parse(msg.content);

            let response;
            switch (request.type) {
                case 'item':
                    response = await userRepository.findById(request.id);
                    break;
                case 'list':
                    response = await userRepository.findByCriteria(request.data, request.offset);
                    break;
                case 'totals':
                    response = await userRepository.total();
                    break;
            }

            channel.sendToQueue(msg.properties.replyTo, Buffer.from(JSON.stringify(response)), {
                correlationId: msg.properties.correlationId
            });

            channel.ack(msg);
        }

        channel.assertQueue(config.rabbitmq.rpc_queue, { durable: false })
            .then(() => {
                channel.prefetch(1);

                return channel.consume(config.rabbitmq.rpc_queue, replyCb);
            })
            .then(() => {
                console.log(' [x] Awaiting RPC requests');
            });
    }
}

module.exports = new RpcServer();
