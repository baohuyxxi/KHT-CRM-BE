import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Resource, ResourceSchema } from './schemas/resource.schema';
import { Share, ShareSchema } from './schemas/share.schema';
import { ResourceService } from './resource.service';
import { ResourceController } from './resource.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Resource.name, schema: ResourceSchema },
      { name: Share.name, schema: ShareSchema },
    ]),
  ],
  providers: [ResourceService],
  controllers: [ResourceController],
  exports: [ResourceService],
})
export class ResourceModule {}
