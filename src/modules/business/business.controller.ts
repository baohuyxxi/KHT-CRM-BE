import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { BusinessService } from "./business.service";
import { CreateBusinessDto } from "./dto/business.dto";
import { Business } from "./schemas/business.schema";
import { Permission } from "../auth/permissions.enum";
import { Permissions } from "../auth/decorators/permissions.decorator";
import { PermissionsGuard } from "../auth/guards/permissions.guard";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import express from 'express';


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
    async findOneBybusId(@Param('id') busId: string): Promise<Business | null> {
        return this.businessService.findOneBybusId(busId);
    }

    @Get()
    @UseGuards(JwtAuthGuard, PermissionsGuard)
    @Permissions(Permission.USER_READ_ANY)
    async findAllOfOwner(@Req() req: express.Request): Promise<Business[]> {
        const user = req.user as { userId: string; roles: string[] };
        return this.businessService.findAllOfOwner(user.userId);
    }
}