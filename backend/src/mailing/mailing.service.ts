import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailingService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    public async sendMail(email: string, activationCode: string) {
        try {
            const transporter = nodemailer.createTransport({
                host: 'smtp.gmail.com',
                port: 587,
                secure: false,
                auth: {
                    user: this.configService.get('SMTP_USER'),
                    pass: this.configService.get('SMTP_PASSWORD'),
                }
            });

            const mailOptions = {
                from: this.configService.get('SMTP_USER'),
                to: email,
                subject: 'SurveyGallery | Активация аккаунта',
                html: `<h1>Добро пожаловать в SurveyGallery!</h1>
                <p>Ваш код активации: <b>${activationCode}</b></p>`,
            };
            await transporter.sendMail(mailOptions);
        } catch (error) {
            console.error('Error when sending an email: ', error);
        }
    }
}
