const express = require("express");
const router = express.Router();
const {
  createEMRS,
  getEMRS,
  getEMRSById,  // ← make sure this is imported
  updateEMRS,
  deleteEMRS
} = require("../controllers/emrsController");

router.post("/create", createEMRS);
router.get("/", getEMRS);
router.get("/:id", getEMRSById);   // ← make sure this line exists
router.put("/:id", updateEMRS);
router.delete("/:id", deleteEMRS);

module.exports = router;