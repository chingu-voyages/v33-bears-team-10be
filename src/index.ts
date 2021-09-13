import express from 'express';
import * as dotenv from 'dotenv';
import passport from 'passport';
import cookieSession from 'cookie-session';
import top25 from './routes/top25';

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

app.use('/auth', authRouter);
app.use('/top-25', top25);

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

