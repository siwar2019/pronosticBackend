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
} from "sequelize-typescript";
import { Events } from "./events";
@Table({
  timestamps: true,
  tableName: "drawSetting",
})
export class DrawSetting extends Model {
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
  correctPhase1!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  incorrectPhase1!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  correctPhase2!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  incorrectPhase2!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  correctPhase3!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  incorrectPhase3!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  correctPhase4!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  incorrectPhase4!: string;

  @AllowNull(true)
  @NotEmpty
  @Column({
    type: DataType.STRING,
  })
  correctChampion!: string;

  @ForeignKey(() => Events)
  @AllowNull(true)
  @Column
  event_id: number;

  @BelongsTo(() => Events)
  events: Events;
}
