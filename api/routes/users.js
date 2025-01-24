const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateUserRole } = require('../controllers/userController');
const { protect } = require('../middleware/auth');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/role/:email', updateUserRole);

module.exports = router;
