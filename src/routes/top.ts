import axios from "axios";
import { Router, Response } from "express";
import { RequestWithUser } from "../types/User";
import { authenticateUser } from "./auth";

const router = Router();

const base_url = 'https://api.spotify.com/v1/me/top';

const endpoint = '/api/top'

router.get("/tracks", authenticateUser, async (req: RequestWithUser, res: Response) => {
    const { accessToken } = req.user;
    const { limit = 25, offset = 0 } = req.query;
    const bearer = "Bearer " + accessToken;

    const url = base_url + "/tracks";
    try {

        const { data: { items } } = await axios.get(url, {
            headers: {
                Authorization: bearer,
            },
            params: {
                limit,
                offset,
            }
        });

        const next = `${endpoint}/tracks?limit=${limit}&offset=${Number(offset)+ Number(limit)}`;
        const previous = offset == 0 ? null : `${endpoint}/tracks?limit=${limit}&offset=${Math.max(Number(offset) - Number(limit), 0)}`;
        res.json({items, next, previous});
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

export { router };