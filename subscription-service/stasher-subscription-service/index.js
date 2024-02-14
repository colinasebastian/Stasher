const server = require('./server');
const Server = new server();
const Subscriber = require("./src/services/subscriber")
const suscriber = new Subscriber();

const Repository = require("./src/repositories/repository");

(async () => {
    try {
        
        await Repository.initRepository();
        await Server.initServer();
        await suscriber.initSubscriber();
    } catch(err) {
        console.log(`Error initializing server: ${err}`);
        process.exit(1);
    }
})();