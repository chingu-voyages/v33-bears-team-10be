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
        res.status(400).send(error);
    }
});

router.get("/artists", authenticateUser, async (req: RequestWithUser, res: Response) => {
    const { accessToken } = req.user;
    const { limit = 25, offset = 0 } = req.query;
    const bearer = "Bearer " + accessToken;

    const url = base_url + "/artists";
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
        res.status(400).send(error);
    }
});

router.get("/genres", authenticateUser, async (req: RequestWithUser, res: Response) => {
    const { accessToken } = req.user;
    const limit = 50; // The limit of artists I can get from Spotify.
    const bearer = "Bearer " + accessToken;

    const url = base_url + "/artists";
    try {

        // I might try to get a loop and get the top 200 artists for more genres, but
        // That's a later idea
        const { data: { items } } = await axios.get(url, {
            headers: {
                Authorization: bearer,
            },
            params: {
                limit,
            }
        });

        const genreMap = new Map();

        items.forEach((artist: { genres: string[]; }) => {
            artist.genres.forEach(genre => {
                if (genreMap.has(genre)) {
                    console.log(genre, genreMap);
                    genreMap.set(genre, genreMap.get(genre) + 1);
                } else {
                    genreMap.set(genre, 1);
                }
            });
        });
        const genres = [];
        for (const [key, value] of genreMap) {
            if (value > 1) {
                genres.push(key);
            }
        }
        res.json({ items: genres });
    } catch (error) {
        res.status(400).send(error);
    }
});

export { router };