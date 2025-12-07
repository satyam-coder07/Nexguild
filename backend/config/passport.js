const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists
            let user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // Update Google ID if not set
                if (!user.googleId) {
                    user.googleId = profile.id;
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName || profile.emails[0].value.split('@')[0], // Fallback to email prefix
                email: profile.emails[0].value,
                avatar: profile.photos?.[0]?.value || '',
                password: Math.random().toString(36).slice(-8) // Random password for OAuth users
            });

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
} else {
    console.warn("⚠️ Google OAuth credentials missing. Google login will not work.");
}

// GitHub OAuth Strategy
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/api/auth/github/callback'
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user exists by GitHub ID or email
            let user = await User.findOne({
                $or: [
                    { githubId: profile.id },
                    { email: profile.emails?.[0]?.value }
                ]
            });

            if (user) {
                // Update GitHub ID if not set
                if (!user.githubId) {
                    user.githubId = profile.id;
                    await user.save();
                }
                return done(null, user);
            }

            // Create new user
            user = await User.create({
                githubId: profile.id,
                name: profile.displayName || profile.username,
                email: profile.emails?.[0]?.value || `${profile.username}@github.com`,
                avatar: profile.photos?.[0]?.value || '',
                github: profile.profileUrl,
                password: Math.random().toString(36).slice(-8) // Random password for OAuth users
            });

            done(null, user);
        } catch (err) {
            done(err, null);
        }
    }));
} else {
    console.warn("⚠️ GitHub OAuth credentials missing. GitHub login will not work.");
}

module.exports = passport;
