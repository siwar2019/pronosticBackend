import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotEmpty,
  AllowNull,
} from "sequelize-typescript";

@Table({
  timestamps: true,
  tableName: "history_score",
})
export class historicScore extends Model {
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
  score!: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  difference!: number;

  @AllowNull(true)
  @Column
  employee_id: number;
}
