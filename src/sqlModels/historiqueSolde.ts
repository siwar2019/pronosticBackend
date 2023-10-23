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
import { User } from "./user";
@Table({
  timestamps: true,
  tableName: "historiqueSolde",
})
export class historiqueSolde extends Model {
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
  employee_number !: string;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  priceUser !: string;

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
  solde!: string;
  

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column
  commercial_user: number

  @ForeignKey(() => Company)
  @AllowNull(true)
  @Column
  company_id: number

  @BelongsTo(() => User)
  users: User

  @BelongsTo(() => Company)
  company: Company
  
}
