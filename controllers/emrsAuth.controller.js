const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const EmrsUser = require("../models/emrsUser.model");
const { toPublicUser } = require("../utils/seedEmrsUsers");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

const emrsLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const userData = await EmrsUser.findOne({
      username: username.trim(),
    });

    if (!userData) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    const token = jwt.sign(
      {
        id: userData._id,
        username: userData.username,
        role: userData.role,
        type: "emrs",
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: toPublicUser(userData),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getEmrsSchools = async (_req, res) => {
  try {
    const schools = await EmrsUser.find({ role: "school" })
      .select("-password")
      .sort({ schoolId: 1 })
      .lean();

    const formatted = schools.map((school) => ({
      ...school,
      id: school.schoolId,
    }));

    return res.status(200).json({
      success: true,
      schools: formatted,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = { emrsLogin, getEmrsSchools };
