const Admin = require('../Model/admin.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registerAdmin(req, res) {
  try {
    const { Fullname, Email, Password } = req.body;

    // Check if any admin already exists (only one admin allowed)
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return res.status(403).json({
        message: "Admin already exists. Only one admin is allowed. Please login with existing credentials."
      });
    }

    // Check if email is already used
    const isAdminExist = await Admin.findOne({ Email });
    if (isAdminExist) {
      return res.status(400).json({
        message: "Admin already exists, Please login"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(Password, 10);

    // Create admin
    const newAdmin = await Admin.create({
      Fullname,
      Email,
      Password: hashedPassword
    });

    // Generate token
    const token = jwt.sign({ id: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie('adminToken', token);

    return res.status(201).json({
      message: "Admin registered successfully",
      token,
      admin: {
        id: newAdmin._id,
        Email,
        Fullname
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function loginAdmin(req, res) {
  try {
    const { Email, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ Email });
    if (!admin) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.Password);
    if (!isPasswordValid) {
      return res.status(400).json({
        message: "Invalid Email or Password"
      });
    }

    // Generate token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '12h' });

    res.cookie('adminToken', token);

    return res.status(200).json({
      message: "Admin logged in successfully",
      token,
      admin: {
        id: admin._id,
        Email,
        Fullname: admin.Fullname
      }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

async function checkAdminExists(req, res) {
  try {
    const adminCount = await Admin.countDocuments();
    return res.status(200).json({
      exists: adminCount > 0,
      message: adminCount > 0 ? "Admin already exists" : "No admin found"
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  registerAdmin,
  loginAdmin,
  checkAdminExists
};
