import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Rating } from './rating.model';
import { rateDto } from './dto/rateDto';
import { FilmsService } from 'src/films/films.service';

@Injectable()
export class RatingService {

    constructor(@InjectModel(Rating) private ratingModel: typeof Rating,
                private filmsService: FilmsService
){}

    async rate(filmId: number, userId: number, dto: rateDto){
        const film = this.filmsService.getOne(filmId)
        if(!film){
            throw new HttpException('Такого фильма не существует', HttpStatus.NOT_FOUND)
        }
        const review = await this.ratingModel.findOne({where: {userId, filmId}})
        if(review){
            throw new HttpException('Вы уже оценивали этот фильм', HttpStatus.BAD_REQUEST)
        }
        await this.ratingModel.create({...dto, userId, filmId})
        await this.filmsService.updateFilmRating(filmId);
        return {
            message: 'Отзыв успешно оставлен'
        }
    }

    async deleteRating(ratingId: number, userId: number) {
        const rating = await this.ratingModel.findByPk(ratingId)
        
        if(!rating){
            throw new HttpException('Этой рецензии не существует', HttpStatus.NOT_FOUND)
        }
        if(rating.userId != userId){
            throw new HttpException('Вы не можете удалить эту рецензию', HttpStatus.BAD_REQUEST)
        }
        const filmId = rating.filmId
        await this.ratingModel.destroy({
            where: { userId, filmId }
        });
        await this.filmsService.updateFilmRating(filmId);

        return { message: 'Оценка удалена, рейтинг фильма пересчитан' };
    }

    async deleteRatingByAdmin(ratingId: number, userId: number) {
        const rating = await this.ratingModel.findByPk(ratingId)
        if(!rating){
            throw new HttpException('Этой рецензии не существует', HttpStatus.NOT_FOUND)
        }
        const filmId = rating.filmId
        await this.ratingModel.destroy({
            where: { userId, filmId }
        });
        await this.filmsService.updateFilmRating(filmId);

        return { message: 'Оценка удалена, рейтинг фильма пересчитан' };
    }

    async findAllRateFilmsByUser(userId: number){
        const filmId = await this.ratingModel.findAll({where: {userId}, attributes: ['filmId']})
        if(!filmId){
            return
        }
        return filmId
    }
}
