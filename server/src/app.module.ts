import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './user/user.model';
import { RoleModule } from './role/role.module';
import { Role } from './role/role.model';
import { UserRole } from './role/user-role.model';
import { AuthModule } from './auth/auth.module';
import { FilmsModule } from './films/films.module';
import { RatingModule } from './rating/rating.module';
import { Film } from './films/films.model';
import { Rating } from './rating/rating.model';
import * as path from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MailerModule } from '@nestjs-modules/mailer';
import { AdminModule } from './admin/admin.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.${process.env.NODE_ENV}.env`,
      isGlobal: true
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres', // или 'mysql', 'sqlite' и др.
      host: process.env.HOST_DB,
      port: Number(process.env.PORT_DB),
      username: process.env.USERNAME_DB,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      models: [User, Role, UserRole, Film, Rating],
      autoLoadModels: true,
      synchronize: true, 
      sync: { alter: true}
    }),
    UserModule,
    RoleModule,
    AuthModule,
    FilmsModule,
    RatingModule,
    ServeStaticModule.forRoot({
      rootPath: path.resolve(process.cwd(), 'static'),
    }),
    MailerModule.forRoot({
      transport: {
        host: process.env.SMTP_HOST, 
        port: Number(process.env.SMTP_PORT), 
        secure: false, 
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      defaults: {
        from: '"ScoreApp" <Dgslawa@yandex.ru>',
      }
    }),
    AdminModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
