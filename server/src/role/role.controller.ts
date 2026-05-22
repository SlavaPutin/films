import { Body, Controller, Get, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateRoleDto } from './dto/createRole.dto';
import { RoleService } from './role.service';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from './role.model';


@Controller('role')
export class RoleController {

    constructor(private roleService: RoleService){}


    @Post()
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Создание роли'})
    @ApiResponse({status: 200, type: Role})
    create(@Body() dto: CreateRoleDto){
        return this.roleService.create(dto)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'Получение всех ролей'})
    @ApiResponse({status: 200, type: Role})
    getAll(){
        return this.roleService.getAll()
    }

    @Get('/:name')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'Получение одной роли'})
    @ApiResponse({status: 200, type: Role})
    getOne(@Param('name') name: string){
        return this.roleService.getOne(name)
    }

    @Post('/delete/:name')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'Получение одной роли'})
    @ApiResponse({status: 200, type: Role})
    delete(@Param('name') name: string){
        return this.roleService.delete(name)
    }
}
