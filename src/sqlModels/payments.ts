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
  ForeignKey,
  BelongsTo,
} from "sequelize-typescript";
import { Company } from "./company";
import { requestCashout } from "./requestCashout";
import { User } from "./user";
@Table({
  timestamps: true,
  tableName: "payments",
})
export class payments extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;


  @AllowNull(true)
  @NotEmpty
  @PrimaryKey
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  email!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  cachout!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  numDeCheque!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ["espéce", "chéque", "virement", "carte credit"],
  })
  typeDePayments!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateEchance!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nameCount!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  numCount!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  nameBq!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  IBAN!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  RIB!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_payed!: boolean;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  commercial_id: number

  @ForeignKey(() => requestCashout)
  @AllowNull(true)
  @Column
  request_id: number

  @BelongsTo(() => User)
  users: User

}