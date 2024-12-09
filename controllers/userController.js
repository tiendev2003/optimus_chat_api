const User = require('../models/users');
const formatResponse = require('../utils/responseFormatter');
const jwt = require('jsonwebtoken'); // Add JWT for token generation
const dotenv = require('dotenv');
dotenv.config();
const cloudinary = require('../utils/cloudinary'); // Import Cloudinary utility
const fs = require('fs');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail'); // Utility to send emails

const JWT_TOKEN = process.env.JWT_TOKEN;

const getAllUsers = async (req, res, next) => {
  try {
    // Dummy data for demonstration
    const users = await User.find();

    res.json(formatResponse('Users fetched successfully', 'success', users));
  } catch (error) {
    next(error);
  }
};

const registerUser = async (req, res, next) => {
  try {
    const { username, phone, email, password } = req.body;
    // Check if user already exists
    const user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res
        .status(400)
        .json(formatResponse('User already exists', 'error'));
    }
    

    const newUser = await User.create({ username, phone, email, password });
    res.json(
      formatResponse('User registered successfully', 'success', newUser)
    );
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      return res
        .status(401)
        .json(formatResponse('Invalid credentials', 'error'));
    }
    user.status = 'online';
    await user.save();
    const token = jwt.sign({ id: user._id }, JWT_TOKEN ?? 'trancongtien', {
      expiresIn: '1h',
    });
    res.json(formatResponse('Login successful', 'success', { user, token }));
  } catch (error) {
    next(error);
  }
};

const getUserInfo = async (req, res, next) => {
  try {
    console.log(req.user);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json(formatResponse('User not found', 'error'));
    }
    res.json(formatResponse('User fetched successfully', 'success', user));
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const userId = req.user.id;
    if (!req.file) {
      return res.status(400).json(formatResponse('No file uploaded', 'error'));
    }
    const uploadResponse = await cloudinary.uploader.upload(req.file.path, {
      upload_preset: 'ml_default',
    });
    // remove file from server
    fs.unlinkSync(req.file.path);
    const user = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.url },
      { new: true }
    ).select('-password');
    res.json(formatResponse('Avatar updated successfully', 'success', user));
  } catch (error) {
    next(error);
  }
};

const logoutUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(formatResponse('User not found', 'error'));
    }
    user.status = 'offline';
    await user.save();
    res.json(formatResponse('User logged out successfully', 'success'));
  } catch (error) {
    next(error);
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const user =
      (await User.findByIdAndDelete(userId).select('-password')) || null;
    if (!user) {
      return res.status(404).json(formatResponse('User not found', 'error'));
    }
    res.json(formatResponse('User deleted successfully', 'success', user));
  } catch (error) {
    next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json(formatResponse('User not found', 'error'));
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/resetpassword/${resetToken}`;
    const variables = {
      name: user.username,
      resetUrl,
    };

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        template: 'resetPassword',
        variables,
      });

      res.json(formatResponse('Email sent', 'success'));
    } catch (error) {
      console.log(error);
 
      return res.status(500).json(formatResponse('Email could not be sent', 'error'));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
};

const updatePassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json(formatResponse('Invalid token', 'error'));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json(formatResponse('Password updated successfully', 'success'));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  registerUser,
  loginUser,
  getUserInfo,
  updateAvatar,
  logoutUser,
  deleteUser,
  forgotPassword,
  updatePassword
};
