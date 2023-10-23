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
  import { Matchs } from "./Matchs";
  import { User } from "./user";


  @Table({
    timestamps: true,
    tableName: "pronosticsMatchs",
  })
  export class PronosticsMatchs extends Model {
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
    point!: number;

    @AllowNull(false)
    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    diff!: number;
  
    @ForeignKey(() => Matchs)
    @AllowNull(true)
    @Column
    match_id: number

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    employee_id: number
   
    @BelongsTo(() => Matchs)
    matchs: Matchs
    
    @BelongsTo(() => User)
    users: User
  }