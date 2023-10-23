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
  BelongsToMany,
  HasMany,
  HasOne,
} from "sequelize-typescript";
import { commercial } from "./commercial";
import { Company } from "./company";
import { Draw } from "./draw";
import { DrawScore } from "./drawScore";
import { Events } from "./events";
import { historiqueSolde } from "./historiqueSolde";
import { payments } from "./payments";
import { Pronostics } from "./pronostic";
import { PronosticsMatchs } from "./pronosticsMatchs";
import { requestCashout } from "./requestCashout";
import { TotalPronostics } from "./totalPronostics";
import { UserEvents } from "./userEvents";


@Table({
  timestamps: true,
  tableName: "user",
})
export class User extends Model {
  @PrimaryKey
  @AutoIncrement
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
    unique: true
  })
  email!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.ENUM,
    allowNull: false,
    values: ["admin", "partner", "employee", "commercial"],
  })
  role!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_active!: boolean;

  @ForeignKey(() => Company)
  @AllowNull(true)
  @Column
  company_id: number


  @ForeignKey(() => commercial)
  @AllowNull(true)
  @Column
  commercial_id: number

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  commercial_user: number

  // @ForeignKey(() => historiqueSolde)
  // @AllowNull(true)
  // @Column
  // commercial_users: number
 
  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  password_token!: string;
  
  @BelongsTo(() => Company)
  company: Company

  @BelongsToMany(() => Events, () => UserEvents)
  events: Events[]

  @HasMany(() => Pronostics)
  pronostics: Pronostics[]

  @HasMany(() => PronosticsMatchs)
  pronosticsMatchs: PronosticsMatchs[]

  @HasMany(() => TotalPronostics)
  totalPronostics: TotalPronostics[]

  @HasOne(() => Draw)
  draw: Draw

  @HasMany(() => DrawScore)
  drawScore: DrawScore[]

  @BelongsTo(() => commercial)
  commercial: commercial

  @HasMany(() => historiqueSolde)
  historiqueSolde: historiqueSolde

  @HasMany(() => requestCashout)
  requestCashout: requestCashout
  
  @HasMany(() => payments)
  payments: payments
}
