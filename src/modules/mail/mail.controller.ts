import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { MailService } from './mail.service';

class WelcomeDto {
  to: string;
  name?: string;
}

class RegisterMailDto {
  to: string;
  name: string;
}

class ForgotPasswordDto {
  to: string;
  link: string;
}

class ResetPasswordDto {
  to: string;
}

class NotificationDto {
  to: string;
  message: string;
}

@ApiTags('send-mail')
@Controller('mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  // 1. Welcome
  @Post('welcome')
  async sendWelcome(@Body() body: WelcomeDto) {
    if (!body?.to) throw new BadRequestException('Missing "to" email');

    return this.mailService.sendEmail({
      to: body.to,
      subject: 'Welcome to our service 🎉',
      type: 'welcome',
      context: { name: body.name || 'Guest' },
    });
  }

  // 2. Register
  @Post('register')
  async sendRegister(@Body() body: RegisterMailDto) {
    if (!body?.to) throw new BadRequestException('Missing "to" email');
    if (!body?.name) throw new BadRequestException('Missing "name"');

    return this.mailService.sendEmail({
      to: body.to,
      subject: 'Thank you for registering!',
      type: 'register',
      context: { name: body.name },
    });
  }

  // 3. Forgot password
  @Post('forgot-password')
  async sendForgot(@Body() body: ForgotPasswordDto) {
    if (!body?.to) throw new BadRequestException('Missing "to" email');
    if (!body?.link) throw new BadRequestException('Missing "link"');

    return this.mailService.sendEmail({
      to: body.to,
      subject: 'Reset your password',
      type: 'forgotPassword',
      context: { link: body.link },
    });
  }

  // 4. Reset password confirmation
  @Post('reset-password')
  async sendReset(@Body() body: ResetPasswordDto) {
    if (!body?.to) throw new BadRequestException('Missing "to" email');

    return this.mailService.sendEmail({
      to: body.to,
      subject: 'Your password has been reset',
      type: 'reset',
      context: {},
    });
  }

  // 5. Notification
  @Post('notification')
  async sendNotification(@Body() body: NotificationDto) {
    if (!body?.to) throw new BadRequestException('Missing "to" email');
    if (!body?.message) throw new BadRequestException('Missing "message"');

    return this.mailService.sendEmail({
      to: body.to,
      subject: '📢 Notification',
      type: 'notification',
      context: { message: body.message },
    });
  }
}
