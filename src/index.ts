import express from 'express';
import * as dotenv from 'dotenv';
import passport from 'passport';

const PORT = process.env.PORT || 3000;

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

dotenv.config();

const app = express();

app.use(passport.initialize());
app.use(passport.session());

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
