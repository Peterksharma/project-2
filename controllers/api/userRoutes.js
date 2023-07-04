//API handles all Json Data
const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');


// Registration Route to Create Users
router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        await User.create({ username, password });
        res.status(200).json({ message: 'User has been created.' })
    } catch (err) {
        console.error(err);
        let message = 'User could not be registered.';
        
        // Sequelize validation error
        if (err.name === 'SequelizeValidationError') {
            message = err.errors.map(e => e.message);
        }
        
        // Sequelize unique constraint error
        if (err.name === 'SequelizeUniqueConstraintError') {
            message = 'Username is already in use.';
        }
        
        res.status(500).json({ error: message });
    }
});


//Login Routes
router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});



module.exports = router;