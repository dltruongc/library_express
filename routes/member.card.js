const router = require("express").Router();
const { body } = require("express-validator");

const { Validation } = require("../middlewares/common");
const MemberCardController = require("../controllers/member.card");

router
  .route("/")
  .get(MemberCardController.getAllCards)
  .post([
    body("staff_id").notEmpty(),
    body("user_id").notEmpty(),
    body("create_date").isDate(),
    body("expire_date").isDate(),
    Validation,
    MemberCardController.createNewCard,
  ]);

router.route("/user/:id_user").get(MemberCardController.findCardByIdUser);

router.route("/:id").get(MemberCardController.findCardById);

module.exports = router;
