import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, Max, Min } from "class-validator";


export class rateDto{
    @ApiProperty({ example: 8.5, description: 'Оценка от 1 до 10' })
    @IsNumber({}, { message: 'Должно быть числом' })
    @Min(1)
    @Max(10)
    readonly value!: number;

    @ApiProperty({ example: 'Крутой фильм!', description: 'Текст рецензии', required: false })
    @IsNotEmpty({message: 'Нужно написать рецензию'})
    @IsString()
    readonly text!: string;
}