const Router = require("koa-router");
const router = new Router();

const AutheticationController = require("./autheticationController");
const authenticationController = new AutheticationController();

router.post("/api/authentication", async (ctx, next) => {
  await authenticationController.authenticate(ctx, next)
}
);

router.put("/api/authentication", async (ctx, next) => {
  await authenticationController.saveAuthentication(ctx, next)
}
);

module.exports = router;