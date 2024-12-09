const express = require('express');
const userController = require('../controllers/userController');
const authenticateToken = require('../middlewares/authentication');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/logout', authenticateToken, userController.logoutUser);
router.post('/forgot-password', authenticateToken, userController.forgotPassword);
router.get('/all', userController.getAllUsers);
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);
router.get('/me', authenticateToken,userController.getUserInfo);
router.post('/upload', authenticateToken, upload.single('avatar'), userController.updateAvatar);

module.exports = router;