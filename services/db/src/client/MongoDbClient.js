const { MongoClient } = require("mongodb");
const config = require('../config');

class MongoDbClient {
    #client;

    async open() {
        const client = new MongoClient(config.mongo.url);

        try {
            this.#client = await client.connect();

            console.log(' [x] MongoDB connection successful');
        } catch (e) {
            console.error(' [x] MongoDB connection error', e.message);
        }
    }

    get client() {
        return this.#client;
    }

    close() {
        this.#client.close();
    }
}

module.exports = new MongoDbClient();
