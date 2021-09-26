import { Router, Response, NextFunction } from 'express';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import passport from 'passport';
import { RequestWithUser, User } from '../types/User';

const router = Router();

const clientID = process.env.CLIENT_ID;
const clientSecret = process.env.CLIENT_SECRET;
const scope = ['user-read-email', 'user-read-private', 'user-top-read'];

const callbackURL = process.env.CALLBACK_URL || '/api/auth/callback';

passport.use(
    new SpotifyStrategy(
        {
            clientID,
            clientSecret,
            callbackURL,
        },
        (accessToken, _refreshToken, _expires_in, profile, done) => {
            const user = {
                accessToken,
                displayName: profile.displayName,
                profileImage: profile.photos,
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

passport.deserializeUser((obj: false | User, done) => {
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
        // profile image returns as an object, but typescript declares it as a string, so we cant access value without the below code.
        // This code does nothign right now, come back and refactor when possible. :)
        if (typeof req.user.profileImage[0] === 'object') {
            const profileImage: { value: string } = <{ value: string }>req.user.profileImage[0];
            req.user = { ...req.user, profileImage: profileImage.value };
        } else if (typeof req.user.profileImage[0] === ('undefined' || 'null')) {
            req.user = { ...req.user, profileImage: null };
        }

        res.redirect(process.env.FRONTEND_URL);
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

router.get('/verify', authenticateUser, (req, res) => {
    res.json(req.user);
})

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, an error is return.
function authenticateUser(req: RequestWithUser, res: Response, next: NextFunction): void {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(401);
    res.send({ message: 'user needs to be logged in' });
}

export { router, authenticateUser };
