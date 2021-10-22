const fakerator = require('fakerator')();
const mongoClient = require("./src/client/MongoDbClient");
const UserRepository = require("./src/repository/UserRepository");

try {
    console.log(' [x] Start to init database data...');

    (async () => {
        await mongoClient.open();
        const userRepository = new UserRepository(mongoClient.client);

        console.log(' [x] Adding users...');
        for (let i = 0; i < 1000000; i += 1000) {
            await userRepository.insertMany(getUsersBath(1000));

            console.log(' [x] Added 1000 users...');
        }

        mongoClient.close();
        console.log(' [x] End to init database data.');
    })();
} catch (e) {
    console.log('INIT ERROR: ', e.message);
}

function getUsersBath(count) {
    let data = [];

    for (let i = 0; i < count; i++) {
        data.push({
            name: fakerator.names.name(),
            email: fakerator.internet.email(fakerator.names.firstName(), fakerator.names.lastNameM()),
            password: fakerator.internet.password(10),
            country: fakerator.address.country(),
            city: fakerator.address.city()
        });
    }

    return data;
}
