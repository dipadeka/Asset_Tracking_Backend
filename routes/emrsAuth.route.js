const express = require("express");
const { emrsLogin, getEmrsSchools } = require("../controllers/emrsAuth.controller");

const router = express.Router();

router.post("/login", emrsLogin);
router.get("/schools", getEmrsSchools);

module.exports = router;
