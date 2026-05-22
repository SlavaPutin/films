import { Body, Controller, Get, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/userCreateDto';
import * as express from 'express'
import { loginDto } from 'src/user/dto/loginDto';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/user/user.model';
@Controller('auth')
export class AuthController {
    
    constructor(private authService: AuthService){}

    @Post('/registration')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Регистрация'})
    @ApiResponse({status: 200, type: User})
    async registration(@Body() dto: CreateUserDto,
                       @Res({ passthrough: true }) response: express.Response
    ){
        const userData = await this.authService.registration(dto);

        response.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            secure: false,  
            path: '/', 
        });
        response.cookie('accessToken', userData.accessToken, {
            maxAge: 15 * 60 * 1000, 
            httpOnly: true, 
            secure: false, 
            path: '/', 
        });
        return{
            user: userData.user
        }
    }

    @Post('login')
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Вход'})
    @ApiResponse({status: 200, type: User})
    async login(@Body() dto: loginDto,
      @Res({ passthrough: true }) response: express.Response  
    ){
        const userData = await this.authService.login(dto);

        response.cookie('refreshToken', userData.refreshToken, {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            httpOnly: true, 
            secure: false,  
            path: '/', 
        });

        response.cookie('accessToken', userData.accessToken, {
            maxAge: 15 * 60 * 1000, 
            httpOnly: true, 
            secure: false, 
            path: '/', 
        });

        return{
            user: userData.user
        }
    }

    @Post('/logout')
    @ApiOperation({summary: 'Выход'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(AuthGuard('jwt'))
    logout(@Req() req,
        @Res({ passthrough: true }) response: express.Response
    ){

        response.clearCookie('refreshToken', {
            httpOnly: true,
            secure: false,
            path: '/',
        });

        response.clearCookie('accessToken', {
            httpOnly: true,
            secure: false,
            path: '/',
        });
        const userId = req.user.id
        return this.authService.logout(userId)
    }

    @Post('/refresh')
    @ApiOperation({summary: 'Обновление Jwt токена'})
    @ApiResponse({status: 200, type: User})
    @UseGuards(AuthGuard('jwt-refresh'))
    async refresh(@Req() req: any, @Res({ passthrough: true }) res: any) {

        const { refreshToken } = req.user; 

        const tokens = await this.authService.refresh(refreshToken);

        res.cookie('refreshToken', tokens?.refreshToken, { 
            httpOnly: true, 
            path: '/', 
            maxAge: 30 * 24 * 60 * 60 * 1000
        });

        res.cookie('accessToken', tokens?.accessToken, { 
            httpOnly: true, 
            path: '/', 
            maxAge: 15 * 60 * 1000
        });
        return {
            user: tokens?.user
        }
    }

    @Get('/activate/:link')
    @ApiOperation({summary: 'Активация аккаунта'})
    @ApiResponse({status: 200, type: User})
    async activate(@Param('link') link: string, @Res() res: express.Response) {
        await this.authService.activate(link);
        return res.redirect(process.env.CLIENT_URL || 'http://localhost:3000'); 
    }

    @Put('/change-email')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Изменение почты'})
    @ApiResponse({status: 200, type: User})
    async changeEmail(
        @Req() req: any, 
        @Body('newEmail') newEmail: string
    ) {
        const userId = req.user.id;
        return this.authService.changeEmail(userId, newEmail);
    }

    @Post('/resend-activation')
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Повторная отправка письма'})
    @ApiResponse({status: 200, type: User})
    async resendActivation(@Req() req: any) {
        const userId = req.user.id;
        return this.authService.resendActivationMail(userId);
    }
}
