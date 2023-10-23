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
  HasMany,
} from "sequelize-typescript";
import { commercial } from "./commercial";
import { User } from "./user";


@Table({
  timestamps: true,
  tableName: "requestCashout",
})
export class requestCashout extends Model {
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
  MtCashout!: string;

  // @AllowNull(true)
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // status!: string;

  // @AllowNull(false)
  // @NotEmpty
  // @Column({
  //   type: DataType.ENUM,
  //   allowNull: false,
  //   values: ["Chèque", "espèce", "virment", "carte credit"],
  // })
  // typePayment!: string;

  @ForeignKey(() => User)
  @Column
  commercial_id: number;

  @BelongsTo(() => User)
  User: User

  // @BelongsTo(() => commercial)
  // commercial: commercial
}
