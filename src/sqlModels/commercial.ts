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
import { requestCashout } from "./requestCashout";
import { User } from "./user";
@Table({
  timestamps: true,
  tableName: "commercial",
})
export class commercial extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  firstName !: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  commissionRate!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cashOut!: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone !: string;

   @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  solde!: string;
  static id: any;

  // @HasMany(() => requestCashout)
  // requestCashout: requestCashout
}
