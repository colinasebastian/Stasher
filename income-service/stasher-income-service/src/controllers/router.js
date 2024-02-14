const Router = require('koa-router');
const IncomeController = require("./incomeController");
const incomeController = new IncomeController();
const router = new Router();

router.post("/api/income", async (ctx, next) =>
    await incomeController.add(ctx, next)
);

router.post("/api/income/:id", async (ctx, next) =>
await incomeController.edit(ctx, next)
);

router.delete("/api/income/:id", async (ctx, next) =>
await incomeController.delete(ctx, next)
);

router.get("/api/income", async (ctx, next) =>
    await incomeController.getByDate(ctx, next)
);

router.post("/api/income/amount", async (ctx, next) =>
    await incomeController.getAmountByDate(ctx, next)
);

router.get("/api/income/category", async (ctx, next) =>
    await incomeController.getByCategory(ctx, next)
);

router.get("/api/income/categories", async (ctx, next) => {
    await incomeController.getTopThree(ctx, next)
})

router.post("/api/incomes/balance", async (ctx, next) =>
    await incomeController.getBalance(ctx, next)
);

module.exports = router;