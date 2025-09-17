import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/business.dto";
import { Business } from "./schemas/business.schema";
import { Permission } from "../auth/permissions.enum";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";


@ApiTags('Businesses')
@Controller('businesses')
export class BusinessController {
    constructor(private readonly businessService: BusinessService) { }
    // Add more endpoints as needed

    @Post("add")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.USER_CREATE_ANY)
    async createBusiness(@Body() body: CreateBusinessDto): Promise<Business> {
        return this.businessService.createBusiness(body);
    }

    @Get(":id")
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.USER_READ_ANY)
    async findAllByUserId(@Param('id') userId: string): Promise<Business[]> {
        return this.businessService.findAllByUserId(userId);
    }
}