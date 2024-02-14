const Router = require('koa-router');
const ExpenseController = require("./expenseController");
const expenseController = new ExpenseController();
const router = new Router();

router.post("/api/expenses", async (ctx, next) =>
    await expenseController.add(ctx, next)
);

router.post("/api/expenses/:id", async (ctx, next) =>
    await expenseController.edit(ctx, next)
);

router.delete("/api/expenses/:id", async (ctx, next) =>
    await expenseController.delete(ctx, next)
);

router.get("/api/expenses", async (ctx, next) =>
    await expenseController.getByDate(ctx, next)
);

router.post("/api/expenses/amount", async (ctx, next) =>
    await expenseController.getAmountByDate(ctx, next)
);

router.get("/api/expenses/category", async (ctx, next) =>
    await expenseController.getByCategory(ctx, next)
);

router.get("/api/expenses/categories", async (ctx, next) => {
    await expenseController.getTopThree(ctx, next)
})

router.post("/api/expenses/balance", async (ctx, next) =>
    await expenseController.getBalance(ctx, next)
);

module.exports = router;