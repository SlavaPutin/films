import { Column, DataType, Table, Model, ForeignKey } from "sequelize-typescript";
import { Role } from "./role.model";
import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/user/user.model";

@Table({tableName: 'role_user', createdAt: false, updatedAt: false})
export class UserRole extends Model<UserRole>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    @ApiProperty({example: '1', description: "Id"})
    declare id: number;

    @ForeignKey(() => User)
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({example: '2', description: "Айди пользователя, которому принадлежит роль"})
    userId!: number;

    @ForeignKey(() => Role)
    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({example: '3', description: "Айди роли"})
    roleId!: number;
}