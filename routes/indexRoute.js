const express = require('express');
const router = express.Router();

function isAuthenticated(req, res, next) {
    // console.log('Checking session persistence in /dashboard...');
    // console.log('Session ID:', req.sessionID);
    // console.log('User in session:', req.user);
    // console.log('Is Authenticated:', req.isAuthenticated());

    if (req.isAuthenticated()) {
        return next();
    }
    // console.log('Redirecting back to /auth/login...');
    req.flash('error', 'Session expired. Please log in again.');
    res.redirect('/auth/login');
}

router.get('/dashboard', isAuthenticated, (req, res) => {
    // console.log('User successfully reached /dashboard');
    res.render('dashboard', { user: req.user });
});




// @route   GET /
// @desc    Landing page
// @access  Public

router.get('/', (req, res) => {

    res.render('index');
});

// router.get('/dashboard', isAuthenticated, (req, res) => {
//     if (!req.user || !req.user.role) {
//         req.flash('error', 'Unauthorized access');
//         return res.redirect('/auth/login');
//     }

//     if (req.user.role === 'admin') {
//         return res.redirect('/admin/dashboard');
//     } else if (req.user.role === 'user') {
//         return res.redirect('/user/dashboard');
//     }

//     req.flash('error', 'Invalid role assigned');
//     res.redirect('/auth/login');
// });


router.get('/admin/dashboard', isAuthenticated, (req, res) => {
    if (!req.user || req.user.role !== 'admin') {
        req.flash('error', 'Unauthorized access');
        return res.redirect('/dashboard');
    }
    res.render('adminDashboard', { user: req.user });
});

router.get('/student/dashboard', isAuthenticated, (req, res) => {
    if (!req.user || req.user.role !== 'student') {
        req.flash('error', 'Unauthorized access');
        return res.redirect('/dashboard');
    }
    res.render('studentDashboard', { user: req.user });
});


// @route   GET /about
// @desc    About page
// @access  Public 
router.get('/about', (req, res) => {

    res.render('about');
});

// @route   GET /contact
// @desc    Contact page
// @access  Public
router.get('/contact', (req, res) => {
    res.render('contact');
});

// @route   GET /privacy
// @desc    Privacy policy page
// @access  Public
router.get('/privacy', (req, res) => {
    res.render('privacy');
});

module.exports = router;
