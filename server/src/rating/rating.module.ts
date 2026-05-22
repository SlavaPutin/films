import { Module } from '@nestjs/common';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Rating } from './rating.model';
import { Film } from 'src/films/films.model';
import { User } from 'src/user/user.model';
import { AuthModule } from 'src/auth/auth.module';
import { FilmsModule } from 'src/films/films.module';

@Module({
  controllers: [RatingController],
  providers: [RatingService],
  imports: [
    SequelizeModule.forFeature([Rating, Film, User]),
    AuthModule, 
    FilmsModule
  ],
  exports: [RatingService]
})
export class RatingModule {}
