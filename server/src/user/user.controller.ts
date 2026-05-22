import { Body, Controller, Get, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/userCreateDto';
import { RoleGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { User } from './user.model';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserRole } from 'src/role/user-role.model';
import { addRoleDto } from './dto/addRoleDto';
import { ConfirmationGuard } from 'src/auth/Guards/confirmation.guard';

@Controller('user')
export class UserController {
    constructor(private userService: UserService){}

    @Post()
    @ApiOperation({summary: 'Создание пользователя'})
    @ApiResponse({status: 200, type: User})
    @UsePipes(new ValidationPipe())
    create(@Body() dto: CreateUserDto){
        const activationLink = ''
        return  this.userService.create(dto, activationLink)
    }

    @Get()
    @UseGuards(AuthGuard('jwt'), ConfirmationGuard)
    @ApiOperation({summary: 'Получение всех пользователей'})
    @ApiResponse({status: 200, type: User})
    getAll(){
        return this.userService.getAll()
    }

    @Get('/:id')
    @UseGuards(AuthGuard('jwt'), ConfirmationGuard)
    @ApiOperation({summary: 'Получение одного пользователей'})
    @ApiResponse({status: 200, type: User})
    getOne(@Param('id') id: number){
        return this.userService.getOne(id)
    }

    @Post('delete/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Удаление пользователя'})
    @ApiResponse({status: 200, type: User})
    delete(@Param('id') id: number,
            @Req() req: any
){
        const userId = req.user.id
        const match = id == userId
        return this.userService.delete(match, id)
    } 

    @Post('ADMIN/delete/:id')
    @Roles('ADMIN')
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @ApiOperation({summary: 'Удаление пользователя'})
    @ApiResponse({status: 200, type: User})
    deleteByAdmin(@Param('id') id: number){
        return this.userService.deleteByAdmin(id)
    }    

    @Get('/profile/:id')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Получение профиля пользователя'})
    @ApiResponse({status: 200, type: User})
    getProfile(@Param('id') userId: number,
                @Req() req: any
){
        const currentUserId = req.user.id
        return this.userService.getProfile(userId, currentUserId)
    }

    @Post('/role')
    @Roles("ADMIN")
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Добавление роли пользователю'})
    @ApiResponse({status: 200, type: UserRole})
    addRole(@Body() dto: addRoleDto){
        return this.userService.addRole(dto)
    }

    @Post('/role/delete')
    @Roles("ADMIN")
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Удаление роли у пользователя'})
    @ApiResponse({status: 200, type: UserRole})
    removeRole(@Body() dto: addRoleDto){
        return this.userService.removeRole(dto)
    }
}
