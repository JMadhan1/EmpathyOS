import type { VercelRequest, VercelResponse } from '@vercel/node';
import express from 'express';
import { registerRoutes } from '../server/routes';
import { createServer } from 'http';

const app = express();
app.use(express.json());

// For Vercel, we need to handle the serverless lifecycle
let routesRegistered = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        if (!routesRegistered) {
            const httpServer = createServer(app);
            await registerRoutes(httpServer, app);
            routesRegistered = true;
        }

        // Handle the request
        return app(req, res);
    } catch (error: any) {
        console.error("Vercel API Handler Error:", error);
        return res.status(500).json({
            message: "Internal Server Error in API Gateway",
            error: error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}
