const express = require('express');
const router = express.Router();
const multer = require('multer');

const storage = multer.diskStorage({
    destination: function(req, file, cb)  {
        cb(null, './uploads');
    },
    filename: function (req,file, cb) {
        cb(null, file.originalname)
          }
});

const upload = multer({ storage: storage });

const { register, login, logout, updateUserProfile, showCurrentUser } = require('../controllers/AuthController');


router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);
router.get('/showUser', showCurrentUser);
router.post('/profile', upload.single('profilePicture'),updateUserProfile)

module.exports = router;