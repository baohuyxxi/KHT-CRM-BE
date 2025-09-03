import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsString } from 'class-validator';

export class ShareResourceDto {
  @ApiProperty()
  @IsMongoId()
  resourceId: string;

  @ApiProperty()
  @IsMongoId()
  sharedWith: string;

  @ApiProperty({ enum: ['viewer', 'editor', 'owner'] })
  @IsString()
  permission: 'viewer' | 'editor' | 'owner';
}
