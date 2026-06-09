const EMRS = require("../models/emrsModel");
const { sanitizeEmrsPayload } = require("../utils/emrsPayloadSanitizer");

// ================= CREATE EMRS =================
const createEMRS = async (req, res) => {
  try {
    const payload = sanitizeEmrsPayload(req.body);

    // ✅ If EMRScode exists, update instead of reject
    if (payload.EMRScode && payload.EMRScode !== null) {
      const existing = await EMRS.findOne({ EMRScode: payload.EMRScode });
      if (existing) {
        const updated = await EMRS.findOneAndUpdate(
          { EMRScode: payload.EMRScode },
          payload,
          { new: true, runValidators: true }
        );
        return res.status(200).json({
          success: true,
          message: "EMRS Data Updated Successfully",
          data: updated
        });
      }
    }

    const emrs = new EMRS(payload);
    const savedEMRS = await emrs.save();

    res.status(201).json({
      success: true,
      message: "EMRS Data Created Successfully",
      data: savedEMRS
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    const status = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    res.status(status).json({
      success: false,
      message: status === 400 ? "Invalid EMRS data" : "Error creating EMRS data",
      error: error.message
    });
  }
};
// ================= GET ALL EMRS =================
const getEMRS = async (req, res) => {
  try {
    const emrs = await EMRS.find();

    res.status(200).json({
      success: true,
      data: emrs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching EMRS data",
      error: error.message
    });
  }
};

const getEMRSById = async (req, res) => {
  try {
    const { id } = req.params;

    const emrs = await EMRS.findById(id);

    if (!emrs) {
      return res.status(404).json({
        success: false,
        message: "EMRS not found"
      });
    }

    res.status(200).json({
      success: true,
      data: emrs
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching EMRS",
      error: error.message
    });
  }
};

// ================= UPDATE EMRS =================
const updateEMRS = async (req, res) => {
  try {
    const { id } = req.params;

    const payload = sanitizeEmrsPayload(req.body);
    const updatedEMRS = await EMRS.findByIdAndUpdate(
      id,
      payload,
      { new: true, runValidators: true }
    );

    if (!updatedEMRS) {
      return res.status(404).json({
        success: false,
        message: "EMRS not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "EMRS updated successfully",
      data: updatedEMRS
    });

  } catch (error) {
    const status = error.statusCode || (error.name === "ValidationError" ? 400 : 500);
    res.status(status).json({
      success: false,
      message: status === 400 ? "Invalid EMRS data" : "Error updating EMRS",
      error: error.message
    });
  }
};

// ================= DELETE EMRS =================
const deleteEMRS = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await EMRS.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "EMRS not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "EMRS deleted successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting EMRS",
      error: error.message
    });
  }
};

// ================= EXPORT =================
module.exports = {
  createEMRS,
  getEMRS,
  getEMRSById,
  updateEMRS,
  deleteEMRS
};