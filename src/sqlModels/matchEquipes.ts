import {
  Table,
  Model,
  Column,
  ForeignKey,
  NotEmpty,
  AllowNull,
  DataType,
} from "sequelize-typescript";
import { Equipes } from "./equipe";
import { Matchs } from "./Matchs";
@Table({
  timestamps: true,
  tableName: "matchs_equipes",
})
export class MatchEquipes extends Model {
  @ForeignKey(() => Matchs)
  @Column
  match_id: number;

  @ForeignKey(() => Equipes)
  @Column
  equipe_id: number;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  })
  order: boolean;
}
