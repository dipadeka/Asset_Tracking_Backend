const EMRS = require("../models/emrsModel");
const { sanitizeEmrsPayload } = require("../utils/emrsPayloadSanitizer");
const nodemailer = require("nodemailer");

const EMAIL_NOTIFICATIONS_ON = process.env.EMAIL_NOTIFICATIONS !== "false";
const EMAIL_USER = process.env.EMAIL_USER || "spmu.dta.assam@gmail.com";
const EMAIL_PASS = process.env.EMAIL_PASS || "";
const EMAIL_TO = process.env.EMAIL_TO || process.env.ADMIN_EMAIL || EMAIL_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || EMAIL_TO;
const isEmailPassPlaceholder = !EMAIL_PASS || /<.*>|password|app[_-]?password/i.test(EMAIL_PASS);
const hasValidEmailCredentials = !!EMAIL_USER && !!EMAIL_PASS && !isEmailPassPlaceholder;

const createEmailTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS,
    },
    logger: true,
    debug: true,
  });
};

const hasAttendancePayload = (payload) =>
  Boolean(
    (payload.studentAttendance || []).length ||
    (payload.teachingStaffAttendance || []).length ||
    (payload.nonTeachingStaffAttendance || []).length
  );

const sendAdminNotification = async (payload, context = "form") => {
  console.log("Admin email notification config:", {
    EMAIL_NOTIFICATIONS_ON,
    EMAIL_USER,
    EMAIL_TO,
    ADMIN_EMAIL,
    hasValidEmailCredentials,
    isEmailPassPlaceholder,
  });

  if (!EMAIL_NOTIFICATIONS_ON) {
    console.warn("Admin email notification is disabled via EMAIL_NOTIFICATIONS=false.");
    return { sent: false, error: "EMAIL_NOTIFICATIONS=false" };
  }

  if (!hasValidEmailCredentials) {
    const errMsg = "Admin email notification not sent: EMAIL_USER or EMAIL_PASS is not configured correctly. Set a valid Gmail app password in .env.";
    console.warn(errMsg);
    return {
      sent: false,
      error: errMsg,
      details: {
        EMAIL_USER,
        ADMIN_EMAIL,
        isEmailPassPlaceholder,
      },
    };
  }

  const transporter = createEmailTransporter();

  try {
    await transporter.verify();
    console.log("Admin email transporter verification succeeded.");
  } catch (error) {
    console.warn("Admin email transporter verification failed:", error.message);
    return { sent: false, error: `Transporter verification failed: ${error.message}` };
  }

  const subject = context === "monthly-attendance"
    ? "Monthly Attendance Submitted for EMRS"
    : "New EMRS Form Submitted";

  const attendanceSummary = (payload.studentAttendance || [])
    .slice(0, 5)
    .map((row) => `${row.month || "N/A"}: ${row.daysPresent || row.totalPresent || row.present || 0}/${row.workingDays || 0}`)
    .join("\n") || "No student attendance summary available.";

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
      <h3>${subject}</h3>
      <p><strong>School:</strong> ${payload.schoolname || "N/A"}</p>
      <p><strong>School Code:</strong> ${payload.EMRScode || "N/A"}</p>
      <p><strong>District:</strong> ${payload.district || "N/A"}</p>
      <p><strong>Submission Type:</strong> ${context === "monthly-attendance" ? "Monthly Attendance" : "EMRS Form"}</p>
      <h4>Attendance Summary</h4>
      <pre style="background:#f5f5f5;padding:12px;border-radius:6px;">${attendanceSummary}</pre>
    </div>
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Asset Tracking" <${EMAIL_USER}>`,
      to: EMAIL_TO,
      subject,
      text: html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim(),
      html,
    });
    console.log("Admin email notification sent to", ADMIN_EMAIL, "info:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
    });
    if (!info.accepted || info.accepted.length === 0) {
      console.warn("Admin email notification was not accepted by SMTP server:", info);
      return { sent: false, info };
    }
    return { sent: true, info };
  } catch (error) {
    console.warn("Admin email notification failed:", error.message);
    return { sent: false, error: error.message };
  }
};

// ================= CREATE EMRS =================
// Always inserts a new document. Re-submitting the same EMRScode must not
// overwrite prior submissions — use PUT /api/emrs/:id to update an existing one.
const createEMRS = async (req, res) => {
  try {
    const payload = sanitizeEmrsPayload(req.body);

    const emrs = new EMRS(payload);
    const savedEMRS = await emrs.save();
    const notificationResult = await sendAdminNotification(
      payload,
      hasAttendancePayload(payload) ? "monthly-attendance" : "form"
    );

    res.status(201).json({
      success: true,
      message: "EMRS Data Created Successfully",
      notificationResult,
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

// ================= TEST EMAIL =================
const testEmailNotification = async (req, res) => {
  const payload = req.body && Object.keys(req.body).length > 0 ? req.body : {
    schoolname: "Test school",
    EMRScode: "TEST_EMAIL",
    district: "Test district",
    studentAttendance: [],
  };

  const notificationResult = await sendAdminNotification(payload, "form");

  return res.status(notificationResult.sent ? 200 : 500).json({
    success: notificationResult.sent,
    notificationResult,
  });
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
// NOTE: this is the PUT /emrs/:id route. If your "Monthly Activity" screen
// submits updates through this endpoint (rather than re-posting to
// createEMRS), it previously sent NO email at all. That's fixed below.
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

    const notificationResult = await sendAdminNotification(
      payload,
      hasAttendancePayload(payload) ? "monthly-attendance" : "form"
    );

    res.status(200).json({
      success: true,
      message: "EMRS updated successfully",
      notificationResult,
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
  deleteEMRS,
  testEmailNotification,
};