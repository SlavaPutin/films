import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';
import { CreateUserDto } from './dto/userCreateDto';
import { RoleService } from 'src/role/role.service';
import { Role } from 'src/role/role.model';
import { Op } from 'sequelize';
import * as bcrypt from 'bcrypt'
import { Film } from 'src/films/films.model';
import { addRoleDto } from './dto/addRoleDto';
import { RatingService } from 'src/rating/rating.service';
import { FilmsService } from 'src/films/films.service';

@Injectable()
export class UserService {
    constructor(@InjectModel(User) private userModel: typeof User,
        private roleService: RoleService,
        private ratingService: RatingService,
        private filmsService: FilmsService
){}

    async onModuleInit() {
        try {
            console.log('=== [DB INIT] Начинаю инициализацию данных ===');
            let adminRole;
            try {
                adminRole = await this.roleService.getOne('ADMIN');
                console.log('— Роль ADMIN уже существует');
            } catch (e) {
                adminRole = await this.roleService.create({
                    name: 'ADMIN',
                    description: 'Администратор с полными правами'
                });
                console.log('— Создана роль: ADMIN');
            }

            try {
                await this.roleService.getOne('USER');
                console.log('— Роль USER уже существует');
            } catch (e) {
                await this.roleService.create({
                    name: 'USER',
                    description: 'Обычный пользователь'
                });
                console.log('— Создана роль: USER');
            }
            const adminMail = 'ADMIN@admin.com'
            const adminName = 'admin';
            const existingAdmin = await this.checkEmail(adminMail);

            if (!existingAdmin) {
                const hashedPassword = await bcrypt.hash('admin123', 5);
                const admin = await this.userModel.create({
                    email: adminMail,
                    password: hashedPassword,
                    name: adminName,
                    activationLink: '',
                    isActivated: true
                });
                await admin.$set('roles', [adminRole.id]);
                
                console.log(`— [SUCCESS] Администратор создан: ${[adminMail, adminName]} / пароль: admin123`);
            } else {
                console.log('— Администратор уже существует');
            }

            console.log('=== [DB INIT] Инициализация завершена успешно ===');
        } catch (error) {
            console.error('!!! [DB INIT ERROR] Ошибка при инициализации:', error);
        }
    }

    async create(dto: CreateUserDto, activationLink: string){
        try{
            const candidate = await this.userModel.findOne({where: {
                [Op.or]: 
                    [
                        {email: dto.email}, 
                        {name: dto.name}
                    ]}})
            if (candidate){
                throw new HttpException('Пользователь уже существует', HttpStatus.BAD_REQUEST)
            }
            const role = await this.roleService.getOne('USER');
            const user = await this.userModel.create({...dto, activationLink});
            await user.$set('roles', [role.id]);
            return await user.reload({
                attributes: { exclude: ['password', 'refreshToken'] }, 
                include: [{
                    model: Role,
                    attributes: ['name'], 
                    through: { attributes: [] }
                }]
            });
        } catch(e){
            throw e
        }
        
    }

    async getAll(){
        return this.userModel.findAll({
            attributes: {exclude: ['password', 'refreshToken']}
        });
    }

    async getOne(id: number){
        return this.userModel.findByPk(id, {attributes: { exclude: ['name'] }, 
                include: [{
                    model: Role,
                    attributes: ['name'], 
                    through: { attributes: [] }
                }] });
    }

    async checkEmail(email: string){
        return this.userModel.findOne({ 
                where: { email }, 
                attributes: { exclude: ['refreshToken', 'name'] }, 
                include: [{
                    model: Role,
                    attributes: ['name'], 
                    through: { attributes: [] }
                }] });
    }

    async delete(match: boolean, id: number){
        try{
            if(match){
                const user = await this.userModel.findByPk(id);
                if (!user) {
                    throw new HttpException('Пользователь не найден или уже удален', HttpStatus.NOT_FOUND);
                }
                const ratingRecords = await this.ratingService.findAllRateFilmsByUser(id);
                
                const filmIds = ratingRecords
                    ? ratingRecords
                        .map((r: any) => Number(r.filmId)) 
                        .filter((filmId) => !isNaN(filmId) && filmId > 0) 
                    : [];
                    
                const uniqueFilmIds = [...new Set(filmIds)];
                await user.destroy();

                if (uniqueFilmIds.length > 0) {
                    for (const filmId of uniqueFilmIds) {
                        await this.filmsService.updateFilmRating(filmId);
                    }
                }

                return { message: 'Пользователь успешно удален' };
            }
            throw new HttpException('Вы не можете удалить', HttpStatus.BAD_REQUEST)
            
        } catch(e){
            throw e
        }
    }

    async deleteByAdmin(id: number) {
        try {
            const user = await this.userModel.findByPk(id);
            if (!user) {
                throw new HttpException('Пользователь не найден или уже удален', HttpStatus.NOT_FOUND);
            }
            const ratingRecords = await this.ratingService.findAllRateFilmsByUser(id);
            
            const filmIds = ratingRecords
                ? ratingRecords
                    .map((r: any) => Number(r.filmId)) 
                    .filter((filmId) => !isNaN(filmId) && filmId > 0) 
                : [];
                
            const uniqueFilmIds = [...new Set(filmIds)];
            await user.destroy();

            if (uniqueFilmIds.length > 0) {
                for (const filmId of uniqueFilmIds) {
                    await this.filmsService.updateFilmRating(filmId);
                }
            }

            return { message: 'Пользователь успешно удален' };
        } catch (e) {
            throw e;
        }
    }

    async updateRefreshToken(id: number, refreshToken: string | null ){
        await this.userModel.update({refreshToken: refreshToken}, {where: {id}})
    }

    async removeRefreshToken(id: number){
        return await this.userModel.update(
            { refreshToken: null },
            { where: { id } } 
        );
    }

    async getProfile(userId: number, currentUserId: number){
        let user
        if(userId != currentUserId){
            user = await this.userModel.findByPk(userId, {
                attributes: ['id','name', 'isActivated'],
                include: [
                    {
                        model: Film,
                        attributes: ['id','title', 'poster', 'year', 'director', 'rating'],
                        through: { 
                            attributes: ['value']
                        }
                    },
                    {
                        model: Role,
                        attributes: ['name', 'id'], 
                        through: { attributes: [] }
                    }
                ]
            });
        } else{
            user = await this.userModel.findByPk(userId, {
                attributes: ['id','name', 'email', 'isActivated'],
                include: [
                    {
                        model: Film,
                        attributes: ['id', 'title', 'poster', 'year', 'director', 'rating'],
                        through: { 
                            attributes: ['value']
                        }
                    },
                    {
                        model: Role,
                        attributes: ['name', 'id'], 
                        through: { attributes: [] }
                    }
                ]
            });
        }
        
        if(!user){
            throw new HttpException('Пользователь не найден', HttpStatus.NOT_FOUND)
        }
        return user
    }


    async addRole(dto: addRoleDto){
        const user = await this.userModel.findOne({where: {name: dto.name}})
        const role = await this.roleService.getOne(dto.role)
        if (!user || !role){
            throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND)
        }
        await user.$add('role', role)
        return await user.reload({ include: [{
            model: Role,
            attributes: ['name'], 
            through: { attributes: [] }
        }] });
    }

    async removeRole(dto: addRoleDto){
        const user = await this.userModel.findOne({where: {name: dto.name}})
        const role = await this.roleService.getOne(dto.role)
        if (!user || !role){
            throw new HttpException("Пользователь или роль не найдены", HttpStatus.NOT_FOUND)
        }
        await user.$remove('role', role)
        return await user.reload({ include: [{
            model: Role,
            attributes: ['name'], 
            through: { attributes: [] }
        }]}); 
    }

    async activateUser(link: string) {
        const user = await this.userModel.findOne({ where: { activationLink: link } });
        if (!user) {
            throw new HttpException('Ссылка недействительна', HttpStatus.BAD_REQUEST);
        }
        user.isActivated = true;
        user.activationLink = null; 
        await user.save();
        return user;
    }

    async updateEmail(userId: number, newEmail: string, newLink: string) {
        const candidate = await this.userModel.findOne({ where: { email: newEmail } });
        if (candidate && candidate.id !== userId) {
            throw new HttpException('Эта почта уже занята', HttpStatus.BAD_REQUEST);
        }

        await this.userModel.update(
            { email: newEmail, activationLink: newLink, isActivated: false },
            { where: { id: userId } }
        );
    }
}
