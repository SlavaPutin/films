import { ApiProperty } from "@nestjs/swagger";
import { BelongsToMany, Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { Rating } from "src/rating/rating.model";
import { User } from "src/user/user.model";


interface CreateFilmAttr{
    title: string,
    year: number | string,
    genre: string,
    director: string,
    poster: string
}

@Table({tableName:'films'})
export class Film extends Model<Film, CreateFilmAttr>{
    @Column({type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true})
    @ApiProperty({example: '1', description: "Id"})
    declare id: number;

    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({example: 'Memento', description: "Название фильма"})
    title!: string;

    @Column({type: DataType.INTEGER, allowNull: false})
    @ApiProperty({example: '2001', description: "Год выхода"})
    year!: number | string;

    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({example: 'Детектив', description: "Жанр"})
    genre!: string;

    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({example: 'Кристофер Нолан', description: "Режиссер"})
    director!: string;

    @Column({type: DataType.STRING, allowNull: false})
    @ApiProperty({example: 'Poster.img', description: "Постер"})
    poster!: string;

    @Column({type: DataType.FLOAT, defaultValue: 0, validate: { min: 0, max: 10 }})
    @ApiProperty({example: '8.5', description: "Рейтинг фильма"})
    rating!: number;

    @BelongsToMany(() => User, () => Rating)
    fans!: User[];

    @HasMany(() => Rating)
    ratings!: Rating[];
}