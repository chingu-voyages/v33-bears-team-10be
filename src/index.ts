import express from 'express';
import * as dotenv from 'dotenv';
import passport from 'passport';
import cookieSession from 'cookie-session';

dotenv.config();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

const app = express();

app.use(
    cookieSession({
        name: 'spotify-auth-session',
        keys: [SECRET],
    }),
);

app.use(passport.initialize());
app.use(passport.session());

// Passport session setup.
//   To support persistent login sessions, Passport needs to be able to
//   serialize users into and deserialize users out of the session. Typically,
//   this will be as simple as storing the user ID when serializing, and finding
//   the user by ID when deserializing. However, since this example does not
//   have a database of user records, the complete spotify profile is serialized
//   and deserialized.
passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

import { router as authRouter } from './routes/auth';

app.use('/auth', authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.get('/', function (req, res) {
    res.send('Hello World');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const server = app.listen(PORT, () => {
    console.log('Spotme!');
});
