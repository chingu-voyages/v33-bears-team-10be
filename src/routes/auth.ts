import { Router, Response, NextFunction } from 'express';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import passport from 'passport';
import { RequestWithUser } from '../types/User';

const router = Router();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = ['user-read-email', 'user-read-private', 'user-top-read'];

passport.use(
    new SpotifyStrategy(
        {
            clientID,
            clientSecret,
            callbackURL: '/auth/callback',
        },
        (accessToken, _refreshToken, _expires_in, profile, done) => {
            const user = {
                accessToken,
                displayName: profile.displayName,
                profileImage: profile.photos[0].valueOf(),
                product: profile.product,
                id: profile.id,
            };
            return done(null, user);
        },
    ),
);

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((obj: false | Express.User, done) => {
    done(null, obj);
});

router.get(
    '/',
    passport.authenticate('spotify', {
        scope,
    }),
);

router.get(
    '/callback',
    passport.authenticate('spotify', { failureRedirect: '/error' }),
    (req: RequestWithUser, res: Response) => {
        res.json(req.user);
    },
);

router.get('/error', (_, res) => {
    res.status(400).json({ message: 'Failed to log in to spotify' });
});

router.get('/logout', (req, res) => {
    console.log('logging out.');
    req.logout();
    res.sendStatus(204);
});

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, an error is return.
function authenticateUser(req: RequestWithUser, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401).json({ message: 'User needs to be logged in first.' });
}

export { router, authenticateUser };
