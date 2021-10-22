const app = require('fastify')({ logger: true });
const users = require('./src/routes/users');
const config = require("./src/config");

// register routes
app.register(users, { prefix: '/users' });

// run the server
(async () => {
    try {
        await app.listen(config.port, config.host);
    } catch (err) {
        app.log.error(err);

        process.exit(1);
    }
})();

