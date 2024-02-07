import nodemailer, { Transporter } from 'nodemailer';
import { IEmailOptions } from '../utils/interfaces';
import { env } from '../utils/methods';
import path from 'path';
import ejs from 'ejs';
// import Logging from '../library/Logging';

export default class MailService {
    private static instance: MailService;
    private transporter!: Transporter;

    private constructor() {}
    //INSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }

    //CREATE CONNECTION FOR DEVELOPMENT
    async createLocalConnection() {
        const account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }

    //CREATE A CONNECTION FOR PRODUCTION
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: env("SMTP_HOST"),
            port: parseInt(env("SMTP_PORT") || "587"),
            service: env("SMTP_SERVICE"),
            // secure: env("SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: env("SMTP_MAIL"),
                pass: env("SMTP_PASSWORD"),
            },
        });
    }

    //SEND MAIL
    async sendMail(
        options: IEmailOptions
    ) {
        // Create a connection based on the environment
        if(env("NODE_ENV") != "production") {
            this.createLocalConnection();
        }
        else{
            this.createConnection();
        }

        const {email, subject, data, template} = options;

        // path to email template file
        const templatePath = path.join(__dirname, "../templates", template);

        // Render the email template with EJS
        const html = await ejs.renderFile(templatePath, data)

        await this.transporter
            .sendMail({ 
                from: env("SMTP_MAIL"),
                to: email,
                subject,
                html,
            })
            .then((info) => {
                // TODO: Implement a logger
                console.info(`- Mail sent successfully!!`);
                console.info(`- [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
                if (process.env.NODE_ENV === 'local') {
                    console.info(`- Nodemailer ethereal URL: ${nodemailer.getTestMessageUrl(
                        info
                    )}`);
                }
            });
    }

    //VERIFY CONNECTION
    async verifyConnection() {
        return this.transporter.verify();
    }
    //CREATE TRANSPORTER
    getTransporter() {
        return this.transporter;
    }
}

// //SEND VERIFICATION MAIL TO USER
// const mailService = MailService.getInstance();
// await mailService.sendMail(req.headers['X-Request-Id'], {
//     to: user.email,
//     subject: 'Verify OTP',
//     html: emailTemplate.html,
// });
