import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";


export class loginDto{
    @IsNotEmpty({ message: 'Email не может быть пустым' })
    @IsEmail({}, { message: 'Некорректный формат email' })
    @ApiProperty({example: 'USER@email.ru', description: "Почта"})
    readonly email!: string;
    
    @IsNotEmpty({ message: 'Пароль не может быть пустым' })
    @ApiProperty({example: '12345', description: "Пароль"})
    readonly password!: string;
}