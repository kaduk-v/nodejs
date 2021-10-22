const config = require("../config");
const { ObjectId } = require("mongodb");

module.exports = class UserRepository {
    #db;
    #collection = 'users';

    constructor(client) {
        this.#db = client.db(config.mongo.database);
    }

    async findById(id) {
        return await this.#db.collection(this.#collection)
            .findOne({ _id: ObjectId(id) });
    }

    async findByCriteria(criteria, offset) {
        const result = await this.#db.collection(this.#collection)
            .find(criteria)
            .skip(parseInt(offset.page))
            .limit(parseInt(offset.limit));

        return {
            count: await result.count(),
            data: await result.toArray()
        }
    }

    async total() {
        const response = [];

        const result = await this.#db.collection(this.#collection).aggregate([{
            $group: {
                _id: "$country",
                count: { $sum: 1 }
            }
        }]);

        await result.forEach((doc) => {
            response.push({
                country: doc._id,
                usersCount: doc.count
            });
        });

        return response;
    }

    async insertOne(document) {
        return await this.#db.collection(this.#collection).insertOne(document);
    }

    async insertMany(documents) {
        return await this.#db.collection(this.#collection).insertMany(documents);
    }
}


