import { Router } from 'express';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import passport from 'passport';

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
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        function (accessToken, refreshToken, expires_in, profile, done) {
            process.nextTick(function () {
                return done(null, { accessToken, refreshToken, expires_in, profile });
            });
        },
    ),
);

router.get(
    '/',
    passport.authenticate('spotify', {
        scope,
    }),
);

router.get('/callback', passport.authenticate('spotify', { failureRedirect: '/failure' }), function (req, res) {
    res.json(req.user);
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/failure', function (req, res) {
    res.status(404).json({ message: 'Failed to log in to spotify' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
router.get('/logout', function (req, res) {
    console.log('logging out.');
    req.logout();
    res.sendStatus(204);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Request = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Response = any;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Next = any;

// Simple route middleware to ensure user is authenticated.
//   Use this route middleware on any resource that needs to be protected.  If
//   the request is authenticated (typically via a persistent login session),
//   the request will proceed. Otherwise, an error is return.
function authenticateUser(req: Request, res: Response, next: Next): unknown {
    if (req.isAuthenticated()) {
        return next();
    }

    res.status(403).json({ message: 'User needs to be logged in first.' });
}

export { router, authenticateUser };
