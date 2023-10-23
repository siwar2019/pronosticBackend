import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotEmpty,
  AllowNull,
  BelongsTo,
  ForeignKey,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { Equipes } from "./equipe";
import { Events } from "./events";
import { GroupeEquipes } from "./groupeEquipes";
import { Order } from "./order";
import { Order_Match } from "./order_match";
@Table({
  timestamps: true,
  tableName: "groupes",
})
export class Groupes extends Model {
  @AutoIncrement
  @PrimaryKey
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

  @ForeignKey(() => Events)
  @AllowNull(true)
  @Column
  event_id: number

  @BelongsTo(() => Events)
  events: Events

  @BelongsToMany(() => Equipes, () => GroupeEquipes)
  equipes: Equipes[]

  @HasMany(() => Order)
  order: Order[]

  @HasMany(() => Order_Match)
  order_match: Order_Match[]
}
