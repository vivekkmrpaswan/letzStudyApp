const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport){
    passport.use(
        new LocalStrategy({usernameField: 'email'}, async (email, password, done) => {
            try {
                const user = await User.findOne({email});
                if(!user){
                    return done(null, false, {message: 'No user found'});   
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if(!isMatch){
                    return done(null, false, {message: 'Incorrect password'});
                }
                return done(null, user);
            } catch (error) {
                return done(error);
            }
        })
    );
    passport.serializeUser((user, done) => {
        // console.log('Serializing user:', user.id);
        done(null, user.id);
    });
    
    passport.deserializeUser(async (id, done) => {
        try {
            // console.log('Deserializing user with ID:', id);
            const user = await User.findById(id);
            // console.log('Deserialized user:', user);
            done(null, user);
        } catch (err) {
            done(err);
        }
    });
    
    
}