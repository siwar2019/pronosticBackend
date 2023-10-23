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
  HasOne,
  CreatedAt,
  UpdatedAt,
  BelongsTo,
} from "sequelize-typescript";
import { Matchs } from "./Matchs";
@Table({
  timestamps: false,
  tableName: "score",
})
export class Score extends Model {
  
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
  equipe1!: string;

  @AllowNull(false)
  @NotEmpty
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  equipe2!: string;

  @ForeignKey(() => Matchs)
  @AllowNull(true)
  @Column
  match_id: number

  @BelongsTo(() => Matchs)
  matchs: Matchs
}
