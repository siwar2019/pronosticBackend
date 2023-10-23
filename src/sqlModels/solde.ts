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
  tableName: "solde",
})
export class Solde extends Model {
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
  solde!: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ["add", "remove", ""],
  })
  action!: string;

  @AllowNull(true)
  @Column
  partner_id: number;

  @AllowNull(true)
  @Column
  employee_id: number;
}
