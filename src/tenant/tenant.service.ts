import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tenant, TenantDocument } from './schemas/tenant.schema';
import { CreateTenantDto } from './dto/create-tenant.dto';

@Injectable()
export class TenantService {
  constructor(
    @InjectModel(Tenant.name) private tenantModel: Model<TenantDocument>,
  ) {}

  async createTenant(data: CreateTenantDto): Promise<Tenant> {
    const existing = await this.tenantModel.findOne({ code: data.code });
    if (existing) {
      throw new ConflictException(
        `Tenant with code ${data.code} already exists`,
      );
    }

    const createdBy = data.createdBy
      ? new Types.ObjectId(data.createdBy)
      : undefined;

    return this.tenantModel.create({ ...data, createdBy });
  }

  async findAll(): Promise<Tenant[]> {
    return this.tenantModel.find().exec();
  }

  async findById(id: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findById(id).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }
    return tenant;
  }

  async findByCode(code: string): Promise<Tenant> {
    const tenant = await this.tenantModel.findOne({ code }).exec();
    if (!tenant) {
      throw new NotFoundException(`Tenant with code ${code} not found`);
    }
    return tenant;
  }

  async updateTenant(
    id: string,
    data: Partial<CreateTenantDto>,
  ): Promise<Tenant> {
    const updated = await this.tenantModel
      .findByIdAndUpdate(
        id,
        {
          ...data,
          createdBy: data.createdBy
            ? new Types.ObjectId(data.createdBy)
            : undefined,
        },
        { new: true },
      )
      .exec();

    if (!updated) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }

    return updated;
  }

  async deleteTenant(id: string): Promise<void> {
    const result = await this.tenantModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Tenant with id ${id} not found`);
    }
  }
}
