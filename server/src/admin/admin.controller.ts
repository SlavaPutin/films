import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation } from '@nestjs/swagger';
import { RoleGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {

    constructor(private adminService: AdminService){}

    @Get('/stats')
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @Roles("ADMIN")
    @ApiOperation({ summary: 'Получение общей статистики фильмов для админки' })
    getAdminStats() {
        return this.adminService.getAdminStats();
    }

    
}
