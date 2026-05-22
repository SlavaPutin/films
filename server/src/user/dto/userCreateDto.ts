import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";


export class CreateUserDto{
    @IsNotEmpty({ message: 'Email не может быть пустым' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    @ApiProperty({example: 'USER@email.ru', description: "Почта"})
    readonly email!: string;

    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    @ApiProperty({example: '12345', description: "Пароль"})
    readonly password!: string;

    @IsNotEmpty({ message: 'Email не может быть пустым' })
    @IsString({message: 'Имя не может состоять только из цифр'})
    @ApiProperty({example: 'USER', description: "Имя"})
    readonly name!: string;
}