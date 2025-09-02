import { Injectable } from '@nestjs/common';
import { TenantService } from '../tenant/tenant.service';

@Injectable()
export class SeedService {
  constructor(private readonly tenantService: TenantService) {}

  async seed() {
    await this.seedTenant();
  }

  private async seedTenant() {
    const defaultTenantCode = 'KIMHONGTHINH';

    const exist = await this.tenantService.findByCode(defaultTenantCode);
    if (exist) {
      console.log(`🌱 Tenant "${defaultTenantCode}" đã tồn tại.`);
      return;
    }

    await this.tenantService.createTenant({
      name: 'Công ty Kim Hồng Thịnh',
      code: defaultTenantCode,
      address: 'Hồ Chí Minh',
      contactEmail: 'admin@kimhongthinh.com',
      contactPhone: '0123456789',
      isActive: true,
    });

    console.log(`🌱 Tenant "${defaultTenantCode}" đã được seed.`);
  }
}
