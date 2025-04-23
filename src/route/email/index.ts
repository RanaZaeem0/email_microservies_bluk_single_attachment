// src/routes/emailRoutes.ts
import express from "express";
import { z } from "zod";
import { EmailSchema } from "../../type/zod";
import { queueEmail, getEmailJob, getAllEmails } from "../../services/emailServies";
import { Request, Response, NextFunction } from "express";
const router = express.Router();

// Queue a new email
router.post('/', async (req: Request, res, next) => {
    try {
        const emailData = EmailSchema.parse(req.body);
        const job = await queueEmail(emailData);


        res.status(200).json({
            success: true,
            message: 'Email queued successfully',
            jobId: job.id,
            priority: emailData.priority
        });
    } catch (error) {
        next(error);
    }
});

router.post('/bulk',)
router.post('/attachment', async (req: Request, res, next) => {
    try {
        const emailData = req.body;
        const job = await queueEmail(emailData);


        res.status(200).json({
            success: true,
            message: 'Email queued successfully',
            jobId: job.id,
            priority: emailData.priority
        });
    } catch (error) {
        next(error);
    }
});

// // Get job status
// router.get('/:jobId', async (
//     req: Request<{ jobId: string }>,
//     res: Response,
//     next: NextFunction
// ) => {
//     try {
//         const jobId = req.params.jobId;
//         const job = await getEmailJob(jobId);

//         if (!job) {
//             return res.status(404).json({
//                 success: false,
//                 message: 'Job not found'
//             });
//         }

//         const state = await job.getState();
//         const progress = job.progress;

//         res.status(200).json({
//             success: true,
//             job: {
//                 id: job.id,
//                 data: {
//                     email: job.data.email,
//                     subject: job.data.subject,
//                     priority: job.data.priority,
//                 },
//                 state,
//                 progress
//             }
//         });
//     } catch (error) {
//         next(error);
//     }
// });



// Get all pending emails
router.get('/', async (req, res, next) => {
    try {
        const emailJobs = await getAllEmails();

        res.status(200).json({
            success: true,
            count: emailJobs.length,
            emails: emailJobs
        });
    } catch (error) {
        next(error);
    }
});

export default router;