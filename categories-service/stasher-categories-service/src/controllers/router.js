const Router = require('koa-router');
const CategoryController = require("./categoryController");
const categoryController = new CategoryController();
const router = new Router();
const Multer = require('@koa/multer');
const storage = Multer.memoryStorage();
const upload = Multer({ storage: storage });


router.post("/api/categories", upload.single('file'), async (ctx, next) => {
    await categoryController.add(ctx, next)
});

router.post("/api/categories/:id", upload.single('file'), async (ctx, next) => {
    await categoryController.edit(ctx, next)
});

router.delete("/api/categories/:id", async (ctx, next) => {
    await categoryController.delete(ctx, next)
});

router.get("/api/categories/family", async (ctx, next) => {
    await categoryController.getByFamily(ctx, next)
})

router.get("/api/categories/name", async (ctx, next) => {
    await categoryController.getByName(ctx, next)
})

router.get("/api/categories", async (ctx, next) => {
    await categoryController.getAll(ctx, next)
})

router.post("/api/categories/qty/:id", upload.single('image'), async (ctx, next) => {
    await categoryController.increaseQtyExpenses(ctx, next)
});

module.exports = router;