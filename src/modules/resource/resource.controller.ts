import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ResourceService } from './resource.service';
import { ShareResourceDto } from './dto/share-resource.dto';

@ApiTags('Resources')
@Controller('resources')
@UseGuards(JwtAuthGuard)
export class ResourceController {
  constructor(private readonly resourceService: ResourceService) {}

  @Post('share')
  async share(@Request() req: any, @Body() dto: ShareResourceDto) {
    return this.resourceService.shareResource(req.user.userId, dto);
  }
}
