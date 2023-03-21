const express = require("express");
const { check } = require("express-validator");

const userController = require("../controllers/user-controller");
const router = express.Router();

router.post("/register", [
    check('email')
    .not()
    .isEmpty()
    .withMessage("Please enter an email address.")
], userController.register);

router.post("/login", [
    check('email')
    .not()
    .isEmpty()
    .withMessage("Please enter an email address.")
], userController.login);

module.exports = router;