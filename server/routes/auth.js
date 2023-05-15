const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.put("/update/:userId", userController.verifyToken, userController.updateUser);
router.put("/reset-password/:userId", userController.resetPassword);

module.exports = router;
