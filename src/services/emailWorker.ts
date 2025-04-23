// src/workers/emailWorker.ts
import { emailQueue } from "../config/queue";
import { updateEmailStatus } from "../db/db";
import { getPriorityLabel, getProcessingTimeByPriority } from "../utils/priority";
import { sendMail } from "../nodeMailer";
import { EmailData } from "../type/zod";

export function setupWorker() {
    emailQueue.process(async (job, done) => {
        const { email, subject, body, priority, password, attachments } = job.data as EmailData;
        const jobId = job.id.toString();

        if (!email || priority === undefined) {
            console.log(`⚠️ Skipping job ${jobId} - missing required data`);
            await updateEmailStatus(jobId, {
                status: 'skipped',
                reason: 'Missing required data',
                skippedAt: new Date().toISOString()
            });
            return done(null);
        }

        console.log(`👷 Processing email job ${jobId}...`, { email, priority, hasAttachments: !!attachments?.length });

        try {
            await updateEmailStatus(jobId, {
                status: 'processing',
                processingStartedAt: new Date().toISOString()
            });

            const priorityLabel = getPriorityLabel(priority);
            console.log(`📧 Sending ${priorityLabel} email to ${email}: "${subject}"`);

            let htmlContent: string | undefined = undefined;
            if (attachments?.length) {
                htmlContent = `
                    <h2>Welcome to Saylani Welfare!</h2>
                    <p>Dear ${email || "User"},</p>
                    <p>Please find the attached document(s).</p>
                    <br/>
                    <p>Regards,<br/>Saylani Welfare Team</p>
                `;
            } else if (password) {
                htmlContent = `
                    <h2>Welcome to Saylani Welfare!</h2>
                    <p>Dear ${email || "Trainer"},</p>
                    <p>Your trainer account has been created successfully.</p>
                    <p>Please use the following temporary password to log in:</p>
                    <p><strong>Password:</strong> ${password}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p>We recommend changing your password after logging in for the first time.</p>
                    <br/>
                    <p>Regards,<br/>Saylani Welfare Team</p>
                `;
            }

            const mailResult = await sendMail({
                to: email,
                subject: subject || 'No Subject',
                text: body || '',
                html: htmlContent,
                attachments: attachments || [],
            });

            await updateEmailStatus(jobId, {
                status: 'completed',
                messageId: mailResult.messageId,
                response: mailResult.response,
                completedAt: new Date().toISOString()
            });

            console.log(`✅ Finished email job ${jobId}`);
            done(null, mailResult);
        } catch (error: any) {
            console.error(`❌ Email job ${jobId} failed:`, error);

            await updateEmailStatus(jobId, {
                status: 'failed',
                error: error.message,
                failedAt: new Date().toISOString()
            });

            done(new Error(`Failed to process email: ${error.message}`));
        }
    });
}