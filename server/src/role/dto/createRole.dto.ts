import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class CreateRoleDto{
    @IsNotEmpty({ message: 'Название не может быть пустым' })
    @IsString({message: 'Название должно быть буквенным'})
    @ApiProperty({example: 'USER', description: "Название роли"})
    readonly name!: string;
    
    @IsNotEmpty({ message: 'Описание не может быть пустым' })
    @IsString({message: 'Описание должно быть буквенным'})
    @ApiProperty({example: 'Пользователь', description: "Описание роли"})
    readonly description!: string;
}