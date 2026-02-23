import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
app.use(express.json());

// A simplified helper since Vercel handles the heavy lifting
let serverInitialized = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (!serverInitialized) {
        const httpServer = createServer(app);
        await registerRoutes(httpServer, app);
        serverInitialized = true;
    }

    return app(req, res);
}
