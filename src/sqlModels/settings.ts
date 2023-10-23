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
  tableName: "settings",
})
export class settings extends Model {
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
  prixUsers!: string;



  // @ForeignKey(() => User)
  // @Column
  // employee_id: number;

  // @BelongsTo(() => User)
  // User: User
}
