import { Body, Controller, Param, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { RatingService } from './rating.service';
import { AuthGuard } from '@nestjs/passport';
import { rateDto } from './dto/rateDto';
import { Roles } from 'src/auth/roles-auth.decorator';
import { RoleGuard } from 'src/auth/Guards/roles.guard';
import { ConfirmationGuard } from 'src/auth/Guards/confirmation.guard';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Rating } from './rating.model';

@Controller('rating')
export class RatingController {

    constructor(private ratingService: RatingService){}

    @Post('/rate/:id')
    @UseGuards(AuthGuard('jwt'), ConfirmationGuard)
    @UsePipes(new ValidationPipe())
    @ApiOperation({summary: 'Выставление рейтинга'})
    @ApiResponse({status: 200, type: Rating})
    rate(@Param('id') filmId: number,
        @Req() req,
        @Body() dto: rateDto
    ){
        const userId = req.user.id
        return this.ratingService.rate(filmId, userId, dto)
    }

    @Post('/delete/:id')
    @UseGuards(AuthGuard('jwt'), ConfirmationGuard)
    @ApiOperation({summary: 'Удаление рейтинга'})
    @ApiResponse({status: 200, type: Rating})
    delete(@Param('id') ratingId: number,
        @Req() req
    ){
        const userId = req.user.id
        return this.ratingService.deleteRating(ratingId, userId)
    }

    @Post('/admin/delete/:id')
    @UseGuards(AuthGuard('jwt'), RoleGuard)
    @Roles('ADMIN')
    @ApiOperation({summary: 'Удаление рейтинга админом'})
    @ApiResponse({status: 200, type: Rating})
    deleteByAdmin(@Param('id') ratingId: number,
        @Req() req
    ){
        const userId = req.user.id
        return this.ratingService.deleteRatingByAdmin(ratingId, userId)
    }


}
