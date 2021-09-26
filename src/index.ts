import express from 'express';
import * as dotenv from 'dotenv';
import passport from 'passport';
import cookieSession from 'cookie-session';
import cors from 'cors';

dotenv.config();

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    credentials: true,
};

const app = express();
app.use(cors(corsOptions));

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
import { router as topRouter } from './routes/top';

app.use('/api/auth', authRouter);
app.use('/api/playlists', playlistRouter);
app.use('/api/top', topRouter);

app.get('/', function (_req, res) {
    res.send('Hello World');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.listen(PORT, () => {
    console.log(`Spotme! Running on port ${PORT}`);
});
