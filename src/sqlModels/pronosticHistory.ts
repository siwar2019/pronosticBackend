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
import { Matchs } from "./Matchs";
import { User } from "./user";

@Table({
  timestamps: true,
  tableName: "pronostics_history",
})
export class pronosticsHistory extends Model {
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
  equipe1!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  equipe2!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ["create", "update"],
  })
  status!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  options!: string;

  @ForeignKey(() => Matchs)
  @AllowNull(true)
  @Column
  match_id: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  employee_id: number;

  @BelongsTo(() => Matchs)
  matchs: Matchs;

  @BelongsTo(() => User)
  users: User;
}
