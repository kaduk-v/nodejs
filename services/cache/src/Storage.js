const TIMEOUT = 60000; // 1 minute

class Storage {
    #storage;

    constructor() {
        this.#storage = new Map();
    }

    set(key, data) {
        this.#storage.set(key, data);

        setTimeout(() => {
            this.delete(key);
        }, TIMEOUT);
    }

    get(key) {
        return this.#storage.get(key);
    }

    has(key) {
        return this.#storage.has(key);
    }

    delete(key) {
        this.#storage.delete(key);
    }

    size() {
        return this.#storage.size;
    }
}

module.exports = new Storage();
