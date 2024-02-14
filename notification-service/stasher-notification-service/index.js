const server = require('./server');
const Server = new server();
const Notification = require("./src/services/notification")
const notification = new Notification();

const Repository = require("./src/repositories/repository");

(async () => {
    try {
        
        await Repository.initRepository();
        await Server.initServer();
        await notification.initNotification();
    } catch(err) {
        console.log(`Error initializing server: ${err}`);
        process.exit(1);
    }
})();