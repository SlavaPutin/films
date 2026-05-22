import { Body, Controller, Get, Param, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FilmsService } from './films.service';
import { CreateFilmDto } from './dto/createFilmDto';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/auth/Guards/roles.guard';
import { Roles } from 'src/auth/roles-auth.decorator';
import { ConfirmationGuard } from 'src/auth/Guards/confirmation.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Film } from './films.model';

@Controller('films')
export class FilmsController {

    constructor(private filmsService: FilmsService){}

    @Post()
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @Roles("ADMIN")
    @UsePipes(new ValidationPipe())
    @UseInterceptors(FileInterceptor('poster'))
    @ApiOperation({summary: 'Создание фильма'})
    @ApiResponse({status: 200, type: Film})
    create(@Body() dto: CreateFilmDto,
            @UploadedFile() image
    ){
        return this.filmsService.create(dto, image)
    }

    @Post('delete/:id')
    @UseGuards(RoleGuard, AuthGuard('jwt'))
    @Roles("ADMIN")
    @ApiOperation({summary: 'Удаление фильма'})
    @ApiResponse({status: 200, type: Film})
    delete(@Param('id') id: number){
        return this.filmsService.delete(id)
    }      
    
    @Get('search/suggestions')
    @ApiOperation({ summary: 'Получение подсказок для быстрого поиска в хедере' })
    @ApiResponse({ status: 200, type: [Film] })
    getSuggestions(@Query('search') search: string) {
        console.log(search)
        return this.filmsService.searchSuggestions(search);
    }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    @ApiOperation({summary: 'Получение всех фильмов'})
    @ApiResponse({status: 200, type: Film})
    getAll(){
        return this.filmsService.getAll()
    }
    
    @Get('/scroll')
    @ApiOperation({summary: 'Бесконечный скролл фильмов'})
    @ApiResponse({status: 200, type: Film})
    getScroll(@Query('page') page: number) {
        return this.filmsService.getInfiniteFilms(page ? +page : 1, 10);
    }

    @Get('/:id')
    @ApiOperation({summary: 'Получение одного фильма'})
    @ApiResponse({status: 200, type: Film})
    @UseGuards(AuthGuard('jwt'))
    getOne(@Param('id') id: number){
        return this.filmsService.getOne(id)
    }



    
}
