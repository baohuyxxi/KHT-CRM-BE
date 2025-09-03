import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Resource, ResourceDocument } from './schemas/resource.schema';
import { Share, ShareDocument } from './schemas/share.schema';
import { ShareResourceDto } from './dto/share-resource.dto';

@Injectable()
export class ResourceService {
  constructor(
    @InjectModel(Resource.name) private resourceModel: Model<ResourceDocument>,
    @InjectModel(Share.name) private shareModel: Model<ShareDocument>,
  ) {}

  async createResource(ownerId: string, type: string, data: any) {
    return this.resourceModel.create({ ownerId, type, data });
  }

  async shareResource(ownerId: string, dto: ShareResourceDto) {
    const resource = await this.resourceModel.findById(dto.resourceId);
    if (!resource) throw new ForbiddenException('Resource not found');

    if (resource.ownerId.toString() !== ownerId.toString()) {
      throw new ForbiddenException('You are not the owner of this resource');
    }

    return this.shareModel.create({
      ...dto,
      createdBy: new Types.ObjectId(ownerId),
    });
  }

  async checkAccess(userId: string, resourceId: string, required: string) {
    const resource = await this.resourceModel.findById(resourceId);

    // Chủ sở hữu luôn có full quyền
    if (resource?.ownerId.toString() === userId.toString()) return true;

    // Kiểm tra share
    const share = await this.shareModel.findOne({
      resourceId,
      sharedWith: userId,
    });

    if (!share) return false;

    if (required === 'viewer') return true;
    if (required === 'editor' && share.permission !== 'viewer') return true;
    if (required === 'owner' && share.permission === 'owner') return true;

    return false;
  }
}
