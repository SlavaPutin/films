import { Column, DataType, ForeignKey, Model, Table, BelongsTo } from "sequelize-typescript";
import { Film } from "src/films/films.model";
import { User } from "src/user/user.model";

interface rateAttr{
    value: number,
    text: string,
    userId: number,
    filmId: number
}

@Table({ tableName: 'ratings' })
export class Rating extends Model<Rating, rateAttr> {
    @Column({ type: DataType.INTEGER, unique: true, autoIncrement: true, primaryKey: true })
    declare id: number;

    @Column({ type: DataType.FLOAT, allowNull: false })
    value!: number; 

    @Column({ type: DataType.TEXT, allowNull: true })
    text!: string; 

    @ForeignKey(() => User)
    @Column({ type: DataType.INTEGER })
    userId!: number;

    @ForeignKey(() => Film)
    @Column({ type: DataType.INTEGER })
    filmId!: number;

    @BelongsTo(() => User)
    user!: User;

    @BelongsTo(() => Film)
    film!: Film;
}