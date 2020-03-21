let express = require('express');

let controller = require('../controllers/auth.controller');

let router = express.Router();

router.post('/login', controller.postLogin);

router.post('/signup', controller.postSignup);

module.exports = router;