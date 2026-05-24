import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { AuthModule } from 'src/auth/auth.module';
import { Rating } from 'src/rating/rating.model';
import { User } from 'src/user/user.model';
import { Film } from 'src/films/films.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
    providers: [AdminService],
    controllers: [AdminController],
    imports: [
        AuthModule,
        SequelizeModule.forFeature([Film, User, Rating])
    ]
})
export class AdminModule {}
