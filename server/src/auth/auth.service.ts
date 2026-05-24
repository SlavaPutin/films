import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from 'src/user/dto/userCreateDto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt'
import { User } from 'src/user/user.model';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from 'src/user/dto/loginDto';
import * as uuid from 'uuid'
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class AuthService {
    constructor(private userService: UserService,
            private jwtService: JwtService,
            private mailService: MailService
    ){}

    private async generateToken(user: User){
        try{
            const payload = {
                id: user.id,
                email: user.email,
                role: user.roles.map(i => i.name),
                isActivated: user.isActivated
            }
            
            const [accessToken, refreshToken] = await Promise.all([
                this.jwtService.signAsync(payload, { expiresIn: '15m', secret: process.env.SECRET_KEY_ACCESS }),
                this.jwtService.signAsync(payload, { expiresIn: '30d', secret: process.env.SECRET_KEY_REFRESH }),
            ]);
            const hashRefreshToken = await bcrypt.hash(refreshToken, 5)
            await this.userService.updateRefreshToken(user.id, hashRefreshToken);
            return { accessToken, refreshToken };
        } catch(e){
            console.log(e)
        }
    }

    private async validateUser(dto: loginDto){
            try{
                const user = await this.userService.checkEmail(dto.email)
                if(!user){
                    throw new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST)
                }
                const password = await bcrypt.compare(dto.password, user.password)
                if(!password){
                    throw new HttpException("Неверный логин или пароль", HttpStatus.BAD_REQUEST)
                }
                return user
            } catch(e){
                throw e
            }
                
        }
    async registration(dto: CreateUserDto){
        try{
            const hashPassword = await bcrypt.hash(dto.password, 5);

            const activationLink = uuid.v4()
            await this.mailService.sendActivationMail(
                dto.email, 
                `${process.env.API_URL}/auth/activate/${activationLink}`
            );
            const user = await this.userService.create({...dto, password: hashPassword}, activationLink)
            const tokens = await this.generateToken(user)
            return {
                ...tokens,
                user
            }
        } catch(e){
            throw e
        }
    }

    async login(dto: loginDto) {
        const user = await this.validateUser(dto);
        const token = await this.generateToken(user);
        return {
            ...token,
            user
        };
    }

    async logout(id: number){
        try{
            await this.userService.removeRefreshToken(id)
            return {message: "Выход успешен"}
        } catch(e){
            throw new UnauthorizedException()
        }
    }

    async refresh(refreshToken: string){
        if(!refreshToken){
            throw new HttpException("Токен отсутствует", HttpStatus.UNAUTHORIZED)
        }
        try{
            const userData = await this.jwtService.verifyAsync(refreshToken, {
                secret: process.env.SECRET_KEY_REFRESH
            });
            const user = await this.userService.getOne(userData.id);
            if (!user || !user.refreshToken) {
                throw new UnauthorizedException();
            }
            const checkToken = await bcrypt.compare(refreshToken, user.refreshToken)
            if (!checkToken) {
                throw new UnauthorizedException("Токен не совпадает");
            };
            const tokens = await this.generateToken(user)
            return {user,
                ...tokens
            }
        }catch(e){
            throw new HttpException("Токен невалиден или просрочен", HttpStatus.UNAUTHORIZED)
        }
    }
    
    async activate(link: string) {
        await this.userService.activateUser(link);
    }

    async changeEmail(userId: number, newEmail: string) {
        try{
            const newLink = uuid.v4();
        
            await this.userService.updateEmail(userId, newEmail, newLink);
            
            await this.mailService.sendActivationMail(
                newEmail,
                `${process.env.API_URL}/auth/activate/${newLink}`
            );

            return { message: "Почта изменена, новое письмо отправлено" };
        } catch(e){
            throw e
        }
        
    }

    async resendActivationMail(userId: number) {
        const user = await this.userService.getOne(userId); 

        if (!user) {
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND);
        }

        if (user.isActivated) {
            throw new HttpException('Аккаунт уже подтвержден', HttpStatus.BAD_REQUEST);
        }

        const newLink = uuid.v4();
        user.activationLink = newLink;
        await user.save();

        await this.mailService.sendActivationMail(
            user.email,
            `${process.env.API_URL}/auth/activate/${newLink}`
        );

        return { message: "Письмо отправлено повторно" };
    }
}
