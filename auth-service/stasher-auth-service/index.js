const server = require('./server');
const Server = new server();
const RedisRepository = require('./src/cache/redisRepository');
const redisRepository = new RedisRepository();

(async () => {
  try {
    await redisRepository.connect();
    await Server.initServer();
  } catch (err) {
    console.log(`Error initializing server: ${err}`);
    process.exit(1);
  }
})();
