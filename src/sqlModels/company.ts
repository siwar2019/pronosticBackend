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
import { historiqueSolde } from "./historiqueSolde";
import { User } from "./user";
@Table({
  timestamps: true,
  tableName: "company",
})
export class Company extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  social_reason!: string; 

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
  })
  employee_number!: number;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  phone!: string;



  @HasMany(() => User,{ onDelete: "CASCADE",onUpdate: "CASCADE"})
  users: User[]

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  photo! : string

  @HasMany(() => historiqueSolde)
  historiqueSolde: historiqueSolde
}
