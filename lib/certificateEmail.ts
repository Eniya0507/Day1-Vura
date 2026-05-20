import nodemailer from "nodemailer";

type SendCertificateEmailInput = {
    recipientEmail: string;
    recipientName: string;
    certificateId: string;
    verifyUrl: string;
};

export async function sendCertificateEmail({ recipientEmail, recipientName, certificateId, verifyUrl }: SendCertificateEmailInput) {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpHost || !smtpUser || !smtpPass || !recipientEmail) {
        return false;
    }

    const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        auth: {
            user: smtpUser,
            pass: smtpPass,
        },
    });

    await transporter.sendMail({
        from: process.env.SMTP_FROM || '"Vura" <noreply@vura.com>',
        to: recipientEmail,
        subject: "Your certificate is ready",
        html: `
            <div style="font-family:Arial,sans-serif;line-height:1.6;color:#111827">
                <h2 style="margin:0 0 12px">Your certificate is ready</h2>
                <p>Hello ${recipientName},</p>
                <p>Your certificate <strong>${certificateId}</strong> has been generated and is ready to view.</p>
                <p><a href="${verifyUrl}">${verifyUrl}</a></p>
                <p>If you did not expect this email, you can ignore it.</p>
            </div>
        `,
    });

    return true;
}