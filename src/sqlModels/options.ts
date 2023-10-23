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
import { Matchs } from "./Matchs";
import { User } from "./user";

@Table({
  timestamps: true,
  tableName: "options",
})
export class Options extends Model {
  @AllowNull(true)
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  forgot_save!: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  use_date_forgot!: string;

  @ForeignKey(() => Matchs)
  @AllowNull(true)
  @Column
  forgot_match_id: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  super_pronostic!: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  use_date_super!: string;

  @ForeignKey(() => Matchs)
  @AllowNull(true)
  @Column
  super_match_id: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  double_score!: boolean;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  use_date_double!: string;

  @ForeignKey(() => Matchs)
  @AllowNull(true)
  @Column
  double_match_id: number;

  @ForeignKey(() => User)
  @Column
  employee_id: number;

  @ForeignKey(() => Events)
  @Column
  event_id: number;
}
