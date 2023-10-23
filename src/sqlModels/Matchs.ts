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
import { Equipes } from "./equipe";
import { Groupes } from "./groupes";
import { MatchEquipes } from "./matchEquipes";
import { Order_Match } from "./order_match";
import { Pronostics } from "./pronostic"
import { PronosticsMatchs } from "./pronosticsMatchs";
import { Score } from "./score"


@Table({
  timestamps: true,
  tableName: "matchs",
})
export class Matchs extends Model {
  @AutoIncrement
  @PrimaryKey
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  id!: number;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  date!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.TIME,
    allowNull: false,
  })
  time!: string;

  
  @NotEmpty
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 1,
  })
  coeff!: number;

  @ForeignKey(() => Groupes)
  @AllowNull(true)
  @Column
  groupe_id: number

  @BelongsTo(() => Groupes)
  groupes: Groupes

  @BelongsToMany(() => Equipes, () => MatchEquipes)
  equipes: Equipes[]

  @HasMany(() => Pronostics)
  pronostics: Pronostics[]

  @HasOne(() => Score)
  score: Score

  @HasMany(() => PronosticsMatchs)
  pronosticsMatchs: PronosticsMatchs[]

  @HasMany(() => Order_Match)
  order_match: Order_Match[]
  match_id: number;
}

