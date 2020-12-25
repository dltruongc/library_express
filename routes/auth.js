const router = require("express").Router();
const { body } = require("express-validator");
const AuthController = require("../controllers/user");
const { Validation } = require("../middlewares/common");
const { MulterMiddleWare } = require("../middlewares/multer");
const { UploadImageHandle } = require("../middlewares/upload");

router.post("/signup", MulterMiddleWare.single("avatar"), UploadImageHandle, [
  AuthController.createNewUser,
]);

router.post("/signin", [
  body("username").notEmpty(),
  body("password").notEmpty(),
  Validation,
  AuthController.login,
]);

module.exports = router;
