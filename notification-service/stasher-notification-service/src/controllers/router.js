const Router = require('koa-router');
const NotificationController = require("./notificationController");
const notificationController = new NotificationController();
const router = new Router();


router.post("/api/notification/user", async (ctx, next) => {
    await notificationController.notify(ctx, next)
});

router.get("/api/notification/user/:email", async (ctx, next) => {
    await notificationController.getAllNotificationByUser(ctx, next)
});

router.delete("/api/notification/category/:category/user/:email", async (ctx, next) => {
    await notificationController.deleteNotify(ctx, next)
});



module.exports = router;