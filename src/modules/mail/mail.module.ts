import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';

@Module({
    imports: [
        MailerModule.forRootAsync({
            useFactory: () => ({
                transport: {
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 465,
                    secure: true, // true nếu 465
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                    tls: { rejectUnauthorized: false },
                },
                defaults: {
                    from: process.env.SMTP_FROM || `"No Reply" <${process.env.SMTP_USER}>`,
                },
                template: {
                    dir: join(process.cwd(), 'templates'), // templates folder ở root của project
                    adapter: new PugAdapter(),
                    options: { strict: true },
                },
            }),
        }),
    ],
    providers: [MailService],
    controllers: [MailController],
    exports: [MailService],
})
export class MailModule { }
