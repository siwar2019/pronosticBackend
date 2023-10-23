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
  HasMany,
  BelongsToMany,
} from "sequelize-typescript";
import { Categories } from "./categories";
import { Draw } from "./draw";
import { DrawScore } from "./drawScore";
import { Groupes } from "./groupes";
import { Order } from "./order";
import { TotalPronostics } from "./totalPronostics";
import { User } from "./user";
import { UserEvents } from "./userEvents";
@Table({
  timestamps: true,
  tableName: "events",
})
export class Events extends Model {
  @AutoIncrement
  @PrimaryKey
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
  })
  name!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  description!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  displayQualification!: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  qualificationType!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
  })
  displayOrder!: boolean;

  @AllowNull(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  is_deleted!: boolean;

  @ForeignKey(() => Categories)
  @Column
  categorieId: number;

  @BelongsTo(() => Categories)
  categories: Categories;

  @HasMany(() => Groupes)
  groupes: Groupes[];

  @BelongsToMany(() => User, () => UserEvents)
  user: User[];

  @HasMany(() => TotalPronostics)
  totalPronostics: TotalPronostics[];

  @HasMany(() => Order)
  order: Order[];

  @HasMany(() => Draw)
  draw: Draw[];

  @HasMany(() => DrawScore)
  drawScore: DrawScore[];
}
