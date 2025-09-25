const express = require('express')
const authMiddleware = require('../middleware/auth-middleware.js')
const {loginUser, registerUser, changePassword} = require('../controllers/auth-controller.js')
const router = express.Router();
//all routes are related to auth and authorization

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/change-password',authMiddleware, changePassword );


module.exports = router;