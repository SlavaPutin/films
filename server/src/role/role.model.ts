import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, Model, Table } from "sequelize-typescript";
import { User } from "src/user/user.model";
import { UserRole } from "./user-role.model";


interface CreateRoleAttr{
    name: string;
    description: string;
}

@Table({tableName:'role'})
export class Role extends Model<Role, CreateRoleAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    @ApiProperty({example: '1', description: "Id"})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    @ApiProperty({example: 'USER', description: "Название роли"})
    name!: string;

    @Column({type: DataType.STRING, allowNull: false, unique: true})
    @ApiProperty({example: 'Пользователь', description: "Описание роли"})
    description!: string;

    @BelongsToMany(() => User, () => UserRole)
    user!: User[]
}