import { authenticateUser } from './auth';
import express from 'express';
import axios from 'axios';
import { RequestWithUser } from '../types/User';

const app = express();

const top25 = app.get('/top-25', authenticateUser, function (req: RequestWithUser, res) {
    console.log(req.user);
    axios.get('https://api.spotify.com/v1/me/top/tracks?limit=25&offset=0', {
        headers: { Authorization: `Bearer ${req.user.accessToken}` }
    })
    .then((response) => console.log(response))
});

export default top25