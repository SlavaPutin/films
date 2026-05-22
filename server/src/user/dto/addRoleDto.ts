import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";


export class addRoleDto{
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'USER', description: "Имя пользователя"})
    readonly name!: string;
    @IsNotEmpty()
    @IsString()
    @ApiProperty({example: 'ADMIN', description: "Название роли"})
    readonly role!: string;
}