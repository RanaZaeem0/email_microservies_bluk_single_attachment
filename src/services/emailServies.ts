// src/services/emailService.ts
import Bull from "bull";
import { EmailData } from "../type/zod";
import { mapToBullPriority } from "../utils/priority";
import { updateEmailStatus } from "../db/db";
import { emailQueue } from "../config/queue";


export async function queueEmail(emailData: EmailData) {
    const { email, password, subject, body, priority, delay } = emailData;

    const bullPriority = mapToBullPriority(priority);

    const job = await emailQueue.add({
        email,
        password,
        subject,
        body,
        priority,
        timestamp: new Date().toISOString()
    }, {
        priority: bullPriority,
        delay
    });

    // Store in Redis for quick lookup
    await updateEmailStatus(job.id.toString(), {
        email,
        subject,
        status: 'queued',
        priority: priority.toString(),
        queuedAt: new Date().toISOString()
    });

    return job;
}

export async function attachmentEmail(emailData: EmailData) {
    const { email, subject, body, priority, delay, attachments } = emailData;

    const bullPriority = mapToBullPriority(priority);

    const job = await emailQueue.add({
        email,
        subject,
        body,
        attachments,
        priority,
        timestamp: new Date().toISOString()
    }, {
        priority: bullPriority,
        delay
    });

    // Store in Redis for quick lookup
    await updateEmailStatus(job.id.toString(), {
        email,
        subject,
        status: 'queued',
        priority: priority.toString(),
        queuedAt: new Date().toISOString()
    });

    return job;
}



export async function getEmailJob(jobId: string) {
    return await emailQueue.getJob(jobId);
}

export async function getAllEmails() {
    const waitingJobs = await emailQueue.getWaiting();
    const activeJobs = await emailQueue.getActive();
    const completedJobs = await emailQueue.getCompleted(0, 100);

    const allJobs = [...waitingJobs, ...activeJobs, ...completedJobs];

    const emailJobs = allJobs.map(job => ({
        id: job.id,
        email: job.data.email,
        subject: job.data.subject,
        priority: job.data.priority,
        timestamp: job.data.timestamp,
        state: job.finishedOn ? 'completed' : job.processedOn ? 'active' : 'waiting'
    }));

    return emailJobs;
}

export async function cleanupOldJobs() {
    try {
        // Keep most recent 1000 completed jobs
        const completedCount = await emailQueue.getCompletedCount();
        if (completedCount > 1000) {
            const jobs = await emailQueue.getCompleted(0, completedCount - 1000);
            for (const job of jobs) {
                await job.remove();
            }
            console.log(`🧹 Cleaned up ${jobs.length} old completed jobs`);
        }

        // Keep most recent 100 failed jobs
        const failedCount = await emailQueue.getFailedCount();
        if (failedCount > 100) {
            const jobs = await emailQueue.getFailed(0, failedCount - 100);
            for (const job of jobs) {
                await job.remove();
            }
            console.log(`🧹 Cleaned up ${jobs.length} old failed jobs`);
        }
    } catch (error) {
        console.error('Error cleaning up old jobs:', error);
    }
}

export async function setupQueueCleanup() {
    await emailQueue.clean(24 * 60 * 60 * 1000, 'completed');
    await emailQueue.clean(24 * 60 * 60 * 1000, 'failed');

    // Run cleanup every hour
    setInterval(cleanupOldJobs, 60 * 60 * 1000);
}

export async function closeQueue() {
    await emailQueue.close();
    console.log("📪 Email queue closed");
}