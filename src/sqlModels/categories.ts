import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotEmpty,
  AllowNull,
  HasMany,
} from "sequelize-typescript";
import { Events } from "./events";
@Table({
  timestamps: true,
  tableName: "categories",
})
export class Categories extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;


  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  sport_icon! : string

  @HasMany(() => Events)
  events: Events[]
}