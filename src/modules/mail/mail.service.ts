// mail.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    private readonly logger = new Logger(MailService.name);

    constructor(private readonly mailerService: MailerService) { }

    private templateMap: Record<string, string> = {
        register: 'register',         // templates/register.pug
        forgotPassword: 'forgot',     // templates/forgot.pug
        resetPassword: 'reset',       // templates/reset.pug
        welcome: 'welcome',           // templates/welcome.pug
        notification: 'notification', // templates/notification.pug
    };

    async sendEmail(params: {
        to: string | string[];
        subject: string;
        type?: keyof MailService['templateMap']; // "register" | "forgotPassword" ...
        context?: Record<string, any>;
        html?: string;
        link?: string;
    }) {
        try {
            const sendParams: any = {
                to: params.to,
                subject: params.subject,
            };

            if (params.type) {
                const template = this.templateMap[params.type];
                if (!template) throw new Error(`Unknown template type: ${params.type}`);

                sendParams.template = template;
                sendParams.context = params.context || {};
            } else if (params.html) {
                sendParams.html = params.html;
            } else {
                sendParams.text = params.context?.text || 'No content';
            }

            await this.mailerService.sendMail(sendParams);
            this.logger.log(
                `Mail sent to ${Array.isArray(params.to) ? params.to.join(',') : params.to
                }`,
            );
            return { success: true };
        } catch (error) {
            this.logger.error('Failed to send mail', error.stack);
            throw error;
        }
    }
}
