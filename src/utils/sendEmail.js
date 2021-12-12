import nodemailer from 'nodemailer';

const host = process.env.SMTP_HOST;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASS;

const sendEmail = (options) => {

    const message = {
        from: 'AlgoApps <no-reply@algoapps.io>',
        to: options.to,
        subject: options.subject,
        text: options.text
    };

    const result = await nodemailer.createTransport({
        host: host,
        port: port,
        auth: {
            user: user,
            pass: pass
        }
    }).sendMail(message);

    console.log(`[server-api] email sent ${result.messageId}`);
    
};