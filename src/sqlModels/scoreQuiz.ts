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
  @Table({
    timestamps: false,
    tableName: "scoreQuizz",
  })
  export class ScoreQuiz extends Model {
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
      type: DataType.INTEGER,
      allowNull: false,
    })
    score!: number;
    @AllowNull(false)
    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    userId!: number;
    @AllowNull(false)
    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    quizId!: number;
  }