const express = require("express");
const router = express.Router();

const validationController = require("../controllers/validationController");

router.post("/validate-rule", validationController.validationController);

module.exports = router;
