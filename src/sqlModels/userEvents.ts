import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  AllowNull,
  NotEmpty,
} from "sequelize-typescript";
import { Events } from "./events";
import { User } from "./user";

@Table({
  timestamps: true,
  tableName: "user_events",
})
export class UserEvents extends Model {
  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  displayQualification!: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active!: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_calculated!: boolean;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_hidden!: boolean;

  @ForeignKey(() => User)
  @Column
  user_id: number;

  @ForeignKey(() => Events)
  @Column
  event_id: number;
}
