import { Request, Response } from "express";
import { emailQueue } from "../config/queue";

const sendPassword = async (req: Request, res: Response) => {

    const body = req.body
    try {
        await emailQueue.add(body)
            .then(() => {
                res.status(200).send("Emial added in Queue.");
            })
            .catch(() => {
                res.status(500).send("Failed to store submission due to queue error.");
            });
    } catch (error) {
        console.error("Redis error in /test:", error);
        res.status(500).send("Failed to store submission due to initial Redis error.");
    }
}

export { sendPassword }