import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Film } from "src/films/films.model";
import { Rating } from "src/rating/rating.model";
import { Role } from "src/role/role.model";
import { UserRole } from "src/role/user-role.model";


interface CreateUserAttr{
    email: string;
    password: string;
    name: string;
    activationLink: string;
    isActivated?: boolean
}

@Table({tableName:'user'})
export class User extends Model<User, CreateUserAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    @ApiProperty({example: '1', description: "Id"})
    declare id: number;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    @ApiProperty({example: 'USER@email.ru', description: "Почта"})
    email!: string;

    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({example: '12345', description: "Пароль"})
    password!: string;

    @Column({type: DataType.STRING, unique: true, allowNull: false})
    @ApiProperty({example: 'USER', description: "Имя"})
    name!: string;

    @Column({type: DataType.STRING})
    @ApiProperty({example: 'token', description: "токен"})
    refreshToken!: string | null;

    @Column({type: DataType.BOOLEAN, defaultValue: false})
    @ApiProperty({example: 'true', description: "потдверждена ли почта"})
    isActivated!: boolean;

    @Column({type: DataType.STRING})
    @ApiProperty({example: 'ссылка', description: "ссылка потдверждения"})
    activationLink!: string | null; 

    @BelongsToMany(() => Role, () => UserRole)
    @ApiProperty({example: 'USER, ADMIN', description: "Роли"})
    roles!: Role[]

    @BelongsToMany(() => Film, () => Rating)
    ratedFilms!: Film[];

    @HasMany(() => Rating, { onDelete: 'CASCADE' })
    ratings!: Rating[];
}