const express = require("express");
const router = express.Router();
const {
  createEMRS,
  getEMRS,
  getEMRSById,  
  updateEMRS,
  deleteEMRS
} = require("../controllers/emrsController");

router.post("/create", createEMRS);
router.get("/", getEMRS);
router.get("/:id", getEMRSById);   
router.put("/:id", updateEMRS);
router.delete("/:id", deleteEMRS);

module.exports = router;