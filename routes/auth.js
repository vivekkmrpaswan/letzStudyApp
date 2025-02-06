const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../models/user');

//Handle register
router.get('/register', (req, res) => {
    res.render('register', { messages:req.flash()});
});

router.post('/register', async (req, res) => {
    const { name, email, password,phoneNumber, role } = req.body;
    try {
        let user = await User.findOne({email});
        if(user) {

            req.flash('error', 'User already exists');
            return res.redirect('/auth/register');
        }


        const hashedPassword = await bcrypt.hash(password, 10);
        user = new User({name, email, password: hashedPassword, phoneNumber, role});
        await user.save();
        req.flash('success', 'Registration successful. Please login.');
        res.redirect('/auth/login');

    } catch(error) {
        // console.error('Error registering user:', error);
        req.flash('error', 'Error registering user');
        res.redirect('/auth/register');
    }

});


//Handle login
router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            // console.error('Authentication Error:', err);
            return next(err);
        }
        if (!user) {
            // console.log('Authentication Failed:', info.message || 'Invalid credentials');
            req.flash('error', info.message || 'Invalid credentials');
            return res.redirect('/auth/login');
        }

        req.logIn(user, (err) => {
            if (err) {
                // console.error('Login Error:', err);
                return next(err);
            }
            // console.log('Redirecting to /dashboard...');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
});


router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.session.destroy(() => {
            res.redirect('/');
        });
    });
});


module.exports = router;

