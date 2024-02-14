const Router = require('koa-router');
const SubscriptionController = require("./subscriptionController");
const subscriptionController = new SubscriptionController();
const router = new Router();

router.post("/api/subscription/user", async (ctx, next) => {
    await subscriptionController.subscribe(ctx, next)
});

router.get("/api/subscription/user/:email", async (ctx, next) => {
    await subscriptionController.getAllSubscribedByUser(ctx, next)
});

router.delete("/api/subscription/category/:category/user/:email", async (ctx, next) => {
    await subscriptionController.unsubscribe(ctx, next)
});




module.exports = router;