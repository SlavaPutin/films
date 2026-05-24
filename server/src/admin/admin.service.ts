import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Film } from 'src/films/films.model';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/user/user.model';

@Injectable()
export class AdminService {
    constructor(
        @InjectModel(Film) private filmModel: typeof Film,
        @InjectModel(User) private userModel: typeof User,
        @InjectModel(Rating) private ratingModel: typeof Rating,
    ) {}

    async getAdminStats() {
        const [totalFilms, totalUsers, totalReviews, avgSystemRating] = await Promise.all([
            this.filmModel.count(),
            this.userModel.count(),
            this.ratingModel.count(),
            this.filmModel.sequelize!.query(
                'SELECT AVG(rating) as "avgRating" FROM films;',
                { type: 'SELECT' }
            )
        ]);

        const rawAvg = (avgSystemRating?.[0] as any)?.avgRating;

        return {
            totalFilms,
            totalUsers,
            totalReviews,
            averageRating: rawAvg ? parseFloat(parseFloat(rawAvg).toFixed(1)) : 0.0
        };
    }
}
