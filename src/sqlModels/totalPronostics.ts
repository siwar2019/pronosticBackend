import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotEmpty,
  AllowNull,
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Events } from "./events";
import { User } from "./user";


@Table({
  timestamps: true,
  tableName: "totalPronostics",
})
export class TotalPronostics extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  point!: number;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  diff!: number;

  @ForeignKey(() => Events)
  @AllowNull(true)
  @Column
  event_id: number

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  employee_id: number

  @BelongsTo(() => Events)
  events: Events

  @BelongsTo(() => User)
  users: User
}