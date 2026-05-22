import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from './films.model';
import { CreateFilmDto } from './dto/createFilmDto';
import { FileService } from 'src/file/file.service';
import * as fs from 'fs';
import * as path from 'path';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/user/user.model';
import { Op } from 'sequelize';

@Injectable()
export class FilmsService {

    constructor(@InjectModel(Film) private filmModel: typeof Film,
        private fileService: FileService
    ){}

    async create(dto: CreateFilmDto, image: any){
        try{
            const imageName = await this.fileService.createdFile(image)
            await this.filmModel.create({...dto, poster: imageName})
            return {message: 'фильм успешно создан'};
        } catch(e){
            throw new HttpException('Не удалось создать фильм', HttpStatus.BAD_REQUEST)
        }
        
    }

    async delete(id: number){
        try{
            const film = await this.filmModel.findByPk(id);
            if (!film){
                throw new HttpException('Фильм не найден или уже удален', HttpStatus.NOT_FOUND);
            };
            if (film.poster) {
                const filePath = path.resolve(__dirname, '..', '..', 'static', film.poster);
                
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath); 
                }
            }

            await film.destroy();
            return {message: 'Фильм успешно удален'};
        } catch(e){
            throw e
        }  
    }

    async getAll() {
        return this.filmModel.findAll()
    }

    async getOne(id: number){
        try{
            return this.filmModel.findByPk(id, {include: [{
                        model: Rating, 
                        attributes: ['id', 'value', 'text'],
                        include: [{ model: User, attributes: ['id','name'] }]
                    }]})
        } catch(e){
            throw new HttpException('Не удалось найти фильм', HttpStatus.NOT_FOUND)
        }
        
    }


    async getInfiniteFilms(page: number = 1, limit: number = 10, genre?: string, year?: string, sortOrder?: string) {
        const offset = (page - 1) * limit;
    
        const whereConditions: any = {};
        
        if (genre) whereConditions.genre = genre;
        if (year) whereConditions.year = year; 

        return await this.filmModel.findAll({
            limit: limit,
            offset: offset,
            where: whereConditions,
            order: [['title', sortOrder === 'desc' ? 'DESC' : 'ASC']], 
            attributes: { exclude: ['updatedAt', 'description'] } 
        });
    }

    async updateFilmRating(filmId: number) {
        const film = await this.filmModel.findByPk(filmId, {
            include: [Rating]
        });

        if (film) {
            if (film.ratings && film.ratings.length > 0) {
                const total = film.ratings.reduce((sum, item) => sum + item.value, 0);
                film.rating = Math.round((total / film.ratings.length) * 10) / 10;
            } else {
                film.rating = 0; 
            }
            await film.save();
        }
    }

    async searchSuggestions(search: string) {
        if (!search) return [];

        return await this.filmModel.findAll({
            where: {
                [Op.or]: [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { director: { [Op.iLike]: `%${search}%` } }, 
                ],
            },
            limit: 5, 
            attributes: ['id', 'title', 'poster', 'year', 'director', 'rating'], 
            order: [['rating', 'DESC']], 
        });
    }
}