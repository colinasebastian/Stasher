const Router = require('koa-router');
const Multer = require('@koa/multer');
const GatewayController = require("./gatewayController");
const storage = Multer.memoryStorage();
const upload = Multer({ storage: storage });
const gatewayController = new GatewayController();
const router = new Router();

router.post("/api/administrator", async (ctx, next) =>
    await gatewayController.registerAdministrator(ctx, next)
);

router.post("/api/user", async (ctx, next) =>
    await gatewayController.registerUser(ctx, next)
);

router.post("/api/login", async (ctx, next) => {
    await gatewayController.login(ctx, next)
});

router.get("/api/key/refresh", async (ctx, next,) => {
    await gatewayController.updateApiKey(ctx, next)
})

router.get("/api/key", async (ctx, next,) => {
    await gatewayController.getApiKey(ctx, next)
})

router.post("/api/administrator/invitation", async (ctx, next) => {
    await gatewayController.sendInvitation(ctx, next)
});

router.post("/api/expenses", async (ctx, next) => {
    await gatewayController.addExpense(ctx, next)
});

router.put("/api/expenses/:id", async (ctx, next) => {
    await gatewayController.editExpense(ctx, next)
})

router.delete("/api/expenses/:id", async (ctx, next) => {
    await gatewayController.deleteExpense(ctx, next)
})

router.get("/api/expenses", async (ctx, next) => {
    await gatewayController.getExpenseByDate(ctx, next)
})

router.get("/api/expenses/amount", async (ctx, next) => {
    await gatewayController.getExpensesAmountByDate(ctx, next)
})

router.get("/api/expenses/category/:category", async (ctx, next) => {
    await gatewayController.getExpensesByCategory(ctx, next)
})

router.post("/api/categories", upload.single('image'), async (ctx, next) => {
    await gatewayController.addCategory(ctx, next)
});

router.put("/api/categories/:id", upload.single('image'), async (ctx, next) => {
    await gatewayController.editCategory(ctx, next)
});

router.delete("/api/categories/:id", async (ctx, next) => {
    await gatewayController.deleteCategory(ctx, next)
});

router.get("/api/expenses/categories", async (ctx, next) => {
    await gatewayController.getTopThreeCategories(ctx, next)
})

router.get("/api/categories", async (ctx, next) => {
    await gatewayController.getCategoriesByFamily(ctx, next)
})

router.post("/api/income", async (ctx, next) => {
    await gatewayController.addIncome(ctx, next)
});

router.put("/api/income/:id", async (ctx, next) => {
    await gatewayController.editIncome(ctx, next)
});

router.delete("/api/income/:id", async (ctx, next) => {
    await gatewayController.deleteIncome(ctx, next)
});

router.post("/api/transaction", async (ctx, next) => {
    await gatewayController.addTransaction(ctx, next)
});
router.get("/api/income", async (ctx, next) => {
    await gatewayController.getIncomeByDate(ctx, next)
})
router.get("/api/income/amount", async (ctx, next) => {
    await gatewayController.getIncomesAmountByDate(ctx, next)
})

router.put("/api/transaction/:id", async (ctx, next) => {
    await gatewayController.editTransaction(ctx, next)
});

router.delete("/api/transaction/:id", async (ctx, next) => {
    await gatewayController.deleteTransaction(ctx, next)
});

router.get("/api/income/category/:category", async (ctx, next) => {
    await gatewayController.getIncomesByCategory(ctx, next)
})

router.post("/api/subscribe/category/:category", async (ctx, next) => {
    await gatewayController.subscribe(ctx, next)
});

router.get("/api/subscribe/", async (ctx, next) => {
    await gatewayController.getSubscriptions(ctx, next)
});

router.delete("/api/subscribe/category/:category", async (ctx, next) => {
    await gatewayController.unsubscribe(ctx, next)
});

router.post("/api/mail", async (ctx, next) => {
    await gatewayController.sendMail(ctx, next)
});

router.post("/api/notification/category/:category", async (ctx, next) => {
    await gatewayController.notify(ctx, next)
});

router.get("/api/notification/", async (ctx, next) => {
    await gatewayController.getNotifications(ctx, next)
});

router.delete("/api/notification/category/:category", async (ctx, next) => {
    await gatewayController.deleteNotify(ctx, next)
});

router.post("/api/balance", async (ctx, next) => {
    await gatewayController.getBalance(ctx, next)
});

module.exports = router;

