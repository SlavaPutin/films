import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";


export class CreateFilmDto{
    @IsNotEmpty({ message: 'Название не может быть пустым' })
    @IsString({message: "Должно быть строкой"})
    @ApiProperty({example: 'Memento', description: "Название фильма"})
    readonly title!: string;

    @IsNotEmpty({message: "Нужно указать год"})
    @ApiProperty({example: '2001', description: "Год выхода"})
    readonly year!: number | string;

    @IsNotEmpty({ message: 'Название жанра не может быть пустым' })
    @IsString({message: "Должно быть строкой"})
    @ApiProperty({example: 'Детектив', description: "Жанр"})
    readonly genre!: string;

    @IsNotEmpty({ message: 'Имя режиссера не может быть пустым' })
    @ApiProperty({example: 'Кристофер Нолан', description: "Режиссер"})
    readonly director!: string;
}