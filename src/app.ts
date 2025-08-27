/* eslint-disable @typescript-eslint/no-unused-vars */
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import expressSession from "express-session";
import "./config/passport"
import { router } from "./routes";
import { envVars } from "./config/env";
import notFound from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import passport from "passport";

const app = express();

app.use(expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.set("trust proxy", 1)
app.use(cors({
    origin: envVars.FRONTEND_URL,
    credentials: true
}))
app.use(cookieParser())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Ride Booking System Backend"
    })
})

app.use(globalErrorHandler)

app.use(notFound)

export default app;