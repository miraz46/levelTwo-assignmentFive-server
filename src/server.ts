/* eslint-disable no-console */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import { envVars } from "./config/env";
import { seedSuperAdmin } from "./utils/seedSuperAdmin";

let server: Server;

const startServer = async () => {
    try {
        await mongoose.connect(envVars.DB_URL)

        console.log("connected to DB!!");

        server = app.listen(envVars.PORT, () => {
            console.log(`server is listening to port ${envVars.PORT}`);
        })
    } catch (error) {
        console.log(error);
    }
}
(async () => {
    await startServer()
    await seedSuperAdmin()
})()

process.on("SIGTERM", () => {
    console.log("SIGTERM signal received....... server shutting down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
})
process.on("SIGINT", () => {
    console.log("SIGINT signal received....... server shutting down");

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
})


process.on("unhandledRejection", (err) => {
    console.log("unhandled Rejection detected....... server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
})

process.on("uncaughtException", (err) => {
    console.log("uncaught Exception detected....... server shutting down", err);

    if (server) {
        server.close(() => {
            process.exit(1)
        })
    }

    process.exit(1);
})