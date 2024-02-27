const express = require("express");
const auth = require("../controllers/auth.controller");

const router = express.Router();

router.route("/register").post(auth.register);
module.exports = router;
