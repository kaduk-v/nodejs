const amqp = require("amqplib");
const storage = require("./Storage");
const config = require("./config");

class RpcServer {
    async #createChannel() {
        const connection = await amqp.connect(config.rabbitmq.url);

        return await connection.createChannel();
    }

    async init() {
        const channel = await this.#createChannel();

        const replyCb = (msg) => {
            const { key } = JSON.parse(msg.content);
            const response = {};

            if (storage.has(key)) {
                response.data = storage.get(key)
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
