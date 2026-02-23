import type { Express } from "express";
import { registerRoutes } from "./routes";
import { createServer } from "http";

export default async function handler(req: any, res: any) {
    const app = require('express')();
    const httpServer = createServer(app);

    app.use(require('express').json());
    await registerRoutes(httpServer, app);

    return app(req, res);
}
