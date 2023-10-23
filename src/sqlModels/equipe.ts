import {
  Table,
  Model,
  Column,
  DataType,
  AutoIncrement,
  PrimaryKey,
  NotEmpty,
  AllowNull,
  BelongsToMany,
  HasMany,
} from "sequelize-typescript";
import { GroupeEquipes } from "./groupeEquipes";
import { Groupes } from "./groupes";
import { MatchEquipes } from "./matchEquipes";
import { Matchs } from "./Matchs";
import { Order } from "./order";
import { Order_Match } from "./order_match";
@Table({
  timestamps: true,
  tableName: "equipes",
})
export class Equipes extends Model {
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
  country!: string;

  // @AllowNull(false)
  // @NotEmpty
  // @Column({
  //   type: DataType.STRING,
  //   allowNull: false,
  // })
  // icon!: string
  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  images!: string

  @BelongsToMany(() => Matchs, () => MatchEquipes)
  matches: Matchs[]

  @BelongsToMany(() => Groupes, () => GroupeEquipes)
  groupes: Groupes[]

  @HasMany(() => Order)
  order: Order[]

  @HasMany(() => Order_Match)
  order_match: Order_Match[]
}