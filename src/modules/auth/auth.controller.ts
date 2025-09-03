import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { Types } from 'mongoose';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Auth') // Gom nhóm API "Auth"
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user under a tenant' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  async register(@Body() dto: RegisterDto) {
    const user = await this.authService.register(dto);
    return {
      data: user,
      message: 'User registered successfully',
    };
  }

  // Login
  @Post('login')
  @ApiOperation({ summary: 'Login with email and password' })
  @ApiResponse({ status: 200, description: 'Return JWT access token' })
  async login(@Body() loginDto: LoginDto) {
    const token = await this.authService.login(loginDto);
    return {
      data: token,
      message: 'Login successful', // 👈 thêm message ở đây
    };
  }

  @Post('refresh')
  async refresh(@Body('refreshToken') refreshToken: string) {
    const data = await this.authService.refresh(refreshToken);
    return {
      message: 'Token refreshed successfully',
      data: data,
    };
  }

  @Post('logout')
  async logout(@Request() req: any, @Body() body: { refreshToken: string }) {
    return this.authService.logout(body.refreshToken);
  }

  @Post('logout-all')
  @UseGuards(JwtAuthGuard)
  async logoutAll(
    @Request() req: any,
    @Body() body: { refreshToken?: string },
  ) {
    const userId = req.user.sub;
    const deleted = await this.authService.logoutAll(userId, body.refreshToken);

    return {
      success: true,
      message: `Logged out successfully. ${deleted} refresh token(s) removed.`,
    };
  }
}
