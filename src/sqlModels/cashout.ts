import {
  Table,
  Model,
  Column,
  ForeignKey,
  DataType,
  AllowNull,
  NotEmpty,
  AutoIncrement,
  PrimaryKey,
  BelongsTo,
} from "sequelize-typescript";
import { User } from "./user";


@Table({
  timestamps: true,
  tableName: "cashout",
})
export class cashout extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;
 
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  commercial_id!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  revenus!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  status!: string;

  // @ForeignKey(() => User)
  // @Column
  // employee_id: number;

  // @BelongsTo(() => User)
  // User: User
}
