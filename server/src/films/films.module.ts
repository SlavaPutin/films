import { Module } from '@nestjs/common';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Film } from './films.model';
import { AuthModule } from 'src/auth/auth.module';
import { FileModule } from 'src/file/file.module';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [
    SequelizeModule.forFeature([Film]),
    AuthModule,
    FileModule
  ],
  exports: [FilmsService]
})
export class FilmsModule {}
