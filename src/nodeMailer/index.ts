import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';
// Create a transporter with configuratio
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // ✅ Not an email address
    port: 465,
    secure: true, // true for port 465, false for 587
    auth: {
        user: 'ranazaeem34@gmail.com', // ✅ This is correct
        pass: process.env.SMTP_PASSWORD // ✅ Make sure you're using App Password if 2FA is enabled
    },
});



export async function verifyMailConnection() {
    try {
        await transporter.verify();
        console.log('✅ SMTP connection verified successfully');
        return true;
    } catch (error) {
        console.error('❌ SMTP connection verification failed:', error);
        return false;
    }
}

// Send email function
export async function sendMail({
    from = "ranazaeem34@gmail.com",
    to,
    subject,
    text,
    html,
    attachments
}: {
    from?: string;
    to: string;
    subject: string;
    text: string;
    html?: string;
    attachments?: Attachment[];
}) {
    try {
        // Send mail with defined transport object
        const info = await transporter.sendMail({
            from: from || `"Email Service" `,
            to,
            subject,
            text,
            html: html || text
        });

        console.log(`📨 Email sent: ${info.messageId}`);
        return {
            success: true,
            messageId: info.messageId,
            response: info.response
        };
    } catch (error) {
        console.error('❌ Failed to send email:', error);
        throw error;
    }
}

export default {
    sendMail,
    verifyMailConnection
};