const amqp = require('amqplib/callback_api');
const SubscriptionService = require("./notificationService");
require("dotenv").config();

module.exports = class Notification {
    constructor() {
       
    }
    
    async initNotification() {
        var raabitmqSettings = {
            protocol: process.env.RABBITMQ_PROTOCOL,
            hostname: process.env.RABBITMQ_HOST,
            port: process.env.RABBITMQ_PORT,
            username:  process.env.RABBITMQ_USER,
            password: process.env.RABBITMQ_PASSWORD
        }
    
    await amqp.connect(raabitmqSettings, async function(err,connection) {
      if (err) {
          throw err;
      }
     
        const channel = await connection.createChannel();
        channel.prefetch(10);
        const queue = 'Category alert';
        const exchange = 'amq.topic';
        const routingKey = 'sign_up_alert';
        process.once('SIGINT', async () => { 
          console.log('got sigint, closing connection');
          await channel.close();
          await connection.close(); 
          process.exit(0);
        });
    
        await channel.assertExchange(exchange, 'topic', {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, routingKey);
        await channel.consume(queue,async (msg) => {
          console.log('Processing alert...');      
          const subscriptionService = new SubscriptionService();
          const messages = msg.content.toString().split(":")
          const message = messages[0]
          const category = messages[1]
          subscriptionService.sendAlert(category,message)
          await channel.ack(msg);
        }, 
        {
          noAck: false,
          consumerTag: 'sign_up_alert'
        });
        console.log(" [*] Waiting for alert. To exit press CTRL+C");

      });

    }

        
}