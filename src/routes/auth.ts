import { Router, Response, NextFunction } from 'express';
import { Strategy as SpotifyStrategy } from 'passport-spotify';
import passport, { use } from 'passport';
import { RequestWithUser, User } from '../types/User';
import axios from 'axios';

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
        (accessToken, refreshToken, expires_in, profile, done) => {
            // Get expiration
            const now = new Date();
            const tokenExpiration = new Date(now.getTime() + (1000 * expires_in));

            // profile image returns as an object, but typescript declares it as a [string], so we cant access value without the below code.
            const profileImageArr = <[{ value: string }]>(<unknown>profile.photos);
            let profileImage: string | undefined;

            // in the case of no profile image.
            if (typeof profileImageArr[0] === 'undefined') {
                profileImage = 'undefined';
            } else {
                profileImage = profileImageArr[0].value;
            }
            const user = {
                accessToken,
                displayName: profile.displayName,
                profileImage,
                product: profile.product,
                id: profile.id,
                refreshToken,
                tokenExpiration
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

router.get('/verify', authenticateUser, (req: RequestWithUser, res) => {
    // Make sure the access token isnt sent along as json.
    const { user } = req;
    const response = {
        displayName: user.displayName,
        profileImage: user.profileImage,
        product: user.product,
        id: user.id,
    }
    res.json(response);
});

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

// Route middleware to check if the current access token is expired, and refress it.
async function refreshAuthenticationToken(req: RequestWithUser, res: Response, next: NextFunction): Promise<void> {
    // Check if token is expired
    const now = new Date();
    if (now > req.user.tokenExpiration) {
        console.trace('Refreshing user token: ', req.user.accessToken);
        try {
            // Encode client id and secret to base 64
            const authToken =  Buffer.from(`${clientID}:${clientSecret}`).toString('base64');
            const authorizationHeader = `Basic  ${authToken}`;

            // Encode parameters to form-urlencoded
            const params = new URLSearchParams({
                grant_type: 'refresh_token',
                refresh_token: req.user.refreshToken,
            });

            const { data } = await axios.post(
                'https://accounts.spotify.com/api/token',
                params.toString()
                ,
                {
                    headers: {
                        Authorization: authorizationHeader,
                        "Content-Type": "application/x-www-form-urlencoded"
                    }
                }
            );

            if (data.access_token) {
                req.user.accessToken = data.access_token;
                req.user.tokenExpiration = new Date(now.getTime() + (1000 * data.expires_in));
            } else {
                // I don't know how this happened, but I guess I'll pass this off
                console.error(data);
                next({
                    status: 400,
                    message: 'Expected \'access_token\', recieved ' + data
                });
            }
        } catch (error) {
            console.error(error);
            next(error);
        }
    }

    return next();
}

export { router, authenticateUser, refreshAuthenticationToken };
