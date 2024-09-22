const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const User = require('./schemas/UserAuth'); // Path to your User model
require('dotenv').config();
const GOOGLE_CLIENT_ID = "274821330011-r9p49elo3hd2kq9uhjl4g0lv6s70a4pv.apps.googleusercontent.com"
const GOOGLE_CLIENT_SECRET= "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"
const MONGO_URI = 'mongodb+srv://arsihoxha23:Arsi159753@cluster0.60zdjwh.mongodb.net/'
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "https://inventorysysdeploy-1.onrender.com/auth/google/callback",
    passReqToCallback: true
  },
  async (request, accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const domain = email.split('@')[1];
      
      if (domain === 'gmail.com') {
        let user = await User.findOne({ googleId: profile.id });

        // Check if the user is blocked
        if (user && user.blocked) {
          return done(null, false, { message: 'User is blocked' });
        }

        if (!user) {
          user = new User({
            googleId: profile.id,
            email: email,
            displayName: profile.displayName,
            profileImage: profile.photos[0].value,
            isAdmin: email === 'history2saga@gmail.com',
            pending: email === 'history2saga@gmail.com' ? false : true // Set pending based on admin status
          });

          await user.save();

          // If user is pending, do not authenticate
          if (user.pending) {
            return done(null, false, { message: 'User is pending approval' });
          }
        } else {
          // Update profile image if it has changed
          if (user.profileImage !== profile.photos[0].value) {
            user.profileImage = profile.photos[0].value;
            await user.save();
          }

          // If user is pending, do not authenticate
          if (user.pending) {
            return done(null, false, { message: 'User is pending approval' });
          }
        }
        return done(null, user);
      } else {
        return done(null, false, { message: 'Unauthorized domain' });
      }
    } catch (err) {
      console.error(err);
      return done(err, false);
    }
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
