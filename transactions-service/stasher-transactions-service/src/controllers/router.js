const Router = require('koa-router');
const TransactionController = require("./transactionController");
const transactionController = new TransactionController();
const router = new Router();

router.post("/api/transaction", async (ctx, next) =>
    await transactionController.add(ctx, next)
);

router.put("/api/transaction/:id", async (ctx, next) =>
await transactionController.edit(ctx, next)
);

router.delete("/api/transaction/:id", async (ctx, next) =>
await transactionController.delete(ctx, next)
);

module.exports = router;