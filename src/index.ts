import express from 'express';
import * as dotenv from 'dotenv';
import passport from 'passport';
import cookieSession from 'cookie-session';
// import top25 from './routes/top25';
import axios from 'axios';
import { RequestWithUser } from './types/User';

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

import { authenticateUser, router as authRouter } from './routes/auth';

app.use('/auth', authRouter);
// app.use('/top-25', top25);

// const top25 = 
app.get('/top-25', authenticateUser, async function (req: RequestWithUser, res) {

    axios.get('https://api.spotify.com/v1/me/top/tracks?limit=25&offset=0', {
        headers: { Authorization: `Bearer ${req.user.accessToken}` }
    })
    .then((response) => (response.data.items.artists))
    .catch((err) => console.log(err))
});

app.get('/', function (_req, res) {
    res.send('Hello World');
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _server = app.listen(PORT, () => {
    console.log('Spotme!');
});
function req(req: any, res: any): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error('Function not implemented.');
}

function res(req: (req: any, res: any) => import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>>, res: any): import("express-serve-static-core").RequestHandler<import("express-serve-static-core").ParamsDictionary, any, any, import("qs").ParsedQs, Record<string, any>> {
    throw new Error('Function not implemented.');
}

