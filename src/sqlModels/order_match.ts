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
import { Equipes } from "./equipe";
import { Groupes } from "./groupes";
import { Matchs } from "./Matchs";
import { Order } from "./order";

  @Table({
    timestamps: true,
    tableName: "order_match",
  })
  export class Order_Match extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    id!: number;
  

    @NotEmpty
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    form!: string;
  
    @ForeignKey(() => Order)
    @AllowNull(true)
    @Column
    order_id: number

    @ForeignKey(() => Matchs)
    @AllowNull(true)
    @Column
    match_id: number

    @ForeignKey(() => Equipes)
    @AllowNull(true)
    @Column
    equipe_id: number

    @ForeignKey(() => Groupes)
    @AllowNull(true)
    @Column
    groupe_id: number
  
    @BelongsTo(() => Order)
    order: Order

    @BelongsTo(() => Matchs)
    matchs: Matchs

    @BelongsTo(() => Equipes)
    equipes: Equipes

    @BelongsTo(() => Groupes)
    groupes: Groupes
   
   
  }