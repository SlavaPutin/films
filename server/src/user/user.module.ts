import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user.model';
import { RoleModule } from 'src/role/role.module';
import { Role } from 'src/role/role.model';
import { AuthModule } from 'src/auth/auth.module';
import { RatingModule } from 'src/rating/rating.module';
import { FilmsModule } from 'src/films/films.module';

@Module({
  providers: [UserService],
  controllers: [UserController],
  imports: [
    SequelizeModule.forFeature([User, Role]),
    RoleModule,
    forwardRef(() => AuthModule),
    RatingModule,
    FilmsModule
  ],
  exports: [UserService]
})
export class UserModule {}
