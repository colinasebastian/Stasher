const server = require('./server');
const RedisRepository = require('./src/cache/redisRepository');
const redisRepository = new RedisRepository();
const Server = new server();
const Repository = require("./src/repositories/repository");

(async () => {
    try {
        await Repository.initRepository();
        await redisRepository.connect();
        await Server.initServer();   
    } catch(err) {
        console.log(`Error initializing server: ${err}`);
        process.exit(1);
    }
})();