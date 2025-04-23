// src/index.ts
import express from "express";
import { connectRedis, disconnectRedis } from "./db/db";
import { setupQueueCleanup, closeQueue } from "./services/emailServies";
import { setupWorker } from "./services/emailWorker";
import emailRoutes from "./route/email";
import { errorHandler } from "./middleware/middleware";
import { verifyMailConnection } from "./nodeMailer";
import dotenv from "dotenv";

dotenv.config({
    path: "../.env"
});






// Express app setup
const app = express();
app.use(express.json());

// Routes
app.use('/api/email', emailRoutes);


// Error handler

// Start the server
async function startServer() {
    try {
        // Connect to Redis
        await connectRedis();
        await verifyMailConnection()
        await setupQueueCleanup();
        setupWorker();

        // Start Express server
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`🚀 Email service running on port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('Shutting down...');
    await closeQueue();
    await disconnectRedis();
    process.exit(0);
});

// Start the server
startServer();