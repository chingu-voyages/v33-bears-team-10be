import { Router, Response } from 'express';
import { RequestWithUser } from '../types/User';
import { authenticateUser } from './auth';
import axios from 'axios';

const router = Router();

const spotify_endpoint = 'https://api.spotify.com/v1/me/playlists';

router.get('/', authenticateUser, async (req: RequestWithUser, res: Response) => {
    const user = req.user;
    const { limit = 10, page = 1 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    const bearer = 'Bearer ' + user.accessToken;

    const { data } = await axios.get(spotify_endpoint, {
        headers: {
            Authorization: bearer,
        },
        params: {
            limit,
            offset,
        },
    });
    res.json({ playlists: data.items });
});

export { router };
