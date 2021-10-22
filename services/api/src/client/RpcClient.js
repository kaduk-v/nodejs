const amqp = require('amqplib');
const uuid = require('uuid');
const config = require('../config');

class RpcClient {
    #connection;
    #rpcQueue;

    constructor(rpcQueue) {
        this.#rpcQueue = rpcQueue;
    }

    async #createChannel() {
        this.#connection = await amqp.connect(config.rabbitmq.url);

        return await this.#connection.createChannel();
    }

    async request(payload) {
        return new Promise(async (resolve) => {
            const correlationId = uuid.v4();
            const channel = await this.#createChannel();
            const responseCb = (msg) => {
                if (msg.properties.correlationId === correlationId) {
                    this.closeConnection();

                    resolve(msg.content.toString());
                }
            };

            channel.assertQueue('', { exclusive: true })
                .then(q => q.queue)
                .then(queue => {
                    return channel.consume(queue, responseCb, { noAck: true }).then(() => queue);
                })
                .then(queue => {
                    channel.sendToQueue(this.#rpcQueue, Buffer.from(JSON.stringify(payload)), {
                        contentType: 'application/json',
                        correlationId: correlationId,
                        replyTo: queue
                    });
                });
        });
    }

    async closeConnection() {
        this.#connection.close();
    }
}

module.exports = RpcClient;
