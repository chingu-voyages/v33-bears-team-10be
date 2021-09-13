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

import { router as authRouter } from './routes/auth';
import { router as playlistRouter } from './routes/playlists';

app.use('/auth', authRouter);
app.use('/playlists', playlistRouter);

app.get('/', function (_req, res) {
    res.send('Hello World');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _server = app.listen(PORT, () => {
    console.log('Spotme!');
});
