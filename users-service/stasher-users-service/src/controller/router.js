const Router = require('koa-router');
const FamilyController = require('./familyController');
const UserController = require("./userController");
const userController = new UserController();
const familyController = new FamilyController();
const router = new Router();

router.post("/api/administrator", async (ctx, next) =>{
    await userController.registerAdministrator(ctx, next)
});

router.post("/api/user", async (ctx, next) =>
    await userController.registerUser(ctx, next)
);

router.post("/api/login", async (ctx, next) =>
    await userController.login(ctx, next)
);

router.get("/api/key/refresh", async (ctx, next) =>
    await userController.updateApiKey(ctx, next)
);

router.get("/api/key", async (ctx, next) =>
    await userController.getApiKey(ctx, next)
);

router.post("/api/administrator/invitation", async (ctx, next) =>
    await userController.sendInvitation(ctx, next)
);

router.get("/api/families/id", async (ctx, next) =>
    await familyController.findFamilyById(ctx, next)
);

router.get("/api/families/key", async (ctx, next) =>
    await familyController.findFamilyByKey(ctx, next)
);

router.get("/api/users", async (ctx, next) =>{
    await userController.findUserByToken(ctx, next)
});

router.get("/api/families", async (ctx, next) =>
    await familyController.getAll(ctx, next)
);

module.exports = router;