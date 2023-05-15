const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const {
  encryptData,
  decryptData,
  publicKey,
  privateKey,
} = require("../config/encryption");
const crypto = require("crypto");

exports.signup = async (req, res) => {
  const { email, mobileNumber, fullName, password } = req.body;
  const saltRounds = 10;

  try {
    // Decrypt PII for finding existing user
    // const decryptedEmail = await decryptData(privateKey, email);
    const existingUser = await User.findOne({
      $or: [{ email: email }, { mobileNumber: mobileNumber }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Encrypt PII
    // const encryptedEmail = encryptData(publicKey, email);
    // const encryptedMobileNumber = encryptData(
    //   publicKey,
    //   mobileNumber.toString()
    // );
    // const encryptedFullName = encryptData(publicKey, fullName);

    // Create new user object
    const user = new User({
      email: email,
      mobileNumber: mobileNumber,
      fullName: fullName,
      password: hashedPassword,
    });

    await user.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    // If user not found or password is incorrect
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Create and sign JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, mobileNumber: user.mobileNumber },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, newPassword } = req.body;
    const userId = req.params;
    console.log(userId.userId, ";;;;;");

    // Validate userId
    if (!mongoose.Types.ObjectId.isValid(userId.userId)) {
      return res.status(400).json({ message: "Invalid userId" });
    }
    async function hashPassword(password, saltRounds) {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      return hashedPassword;
    }

    // Update user data
    const updatedUser = await User.findByIdAndUpdate(
      userId.userId,
      {
        fullName: fullName,
        email: email,
        mobileNumber: mobileNumber,
        password: newPassword ? await hashPassword(newPassword, 10) : undefined,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.json(updatedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

exports.verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

exports.resetPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    console.log();
    if (
      !oldPassword ||
      oldPassword.length <= 0 ||
      !newPassword ||
      newPassword.length <= 0
    ) {
      return res.status(400).json({ error: "Enter old and new password" });
    } else if (oldPassword === newPassword) {
      return res
        .status(402)
        .json({ error: "New password must be different from the old password" });
    } else {
      const user = await User.findById(req.params.userId);

      if (!user) {
        return res.status(401).json({ error: "User not found" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);

      if (!isMatch) {
        return res.status(401).json({ error: "Invalid credentials" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
