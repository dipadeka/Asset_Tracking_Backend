const EMRS = require("../models/emrsModel");

// ================= CREATE EMRS =================
const createEMRS = async (req, res) => {
  try {
    // ✅ If EMRScode exists, update instead of reject
    if (req.body.EMRScode && req.body.EMRScode !== null) {
      const existing = await EMRS.findOne({ EMRScode: req.body.EMRScode });
      if (existing) {
        const updated = await EMRS.findOneAndUpdate(
          { EMRScode: req.body.EMRScode },
          req.body,
          { new: true }
        );
        return res.status(200).json({
          success: true,
          message: "EMRS Data Updated Successfully",
          data: updated
        });
      }
    }

    const emrs = new EMRS(req.body);
    const savedEMRS = await emrs.save();

    res.status(201).json({
      success: true,
      message: "EMRS Data Created Successfully",
      data: savedEMRS
    });

  } catch (error) {
    console.error("FULL ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Error creating EMRS data",
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

    const updatedEMRS = await EMRS.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }  //  runValidators
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
    res.status(500).json({
      success: false,
      message: "Error updating EMRS",
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