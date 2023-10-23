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
import { Events } from "./events";
import { Groupes } from "./groupes";
import { Order_Match } from "./order_match";

  @Table({
    timestamps: true,
    tableName: "order",
  })
  export class Order extends Model {
    @AutoIncrement
    @PrimaryKey
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
    })
    id!: number;
  

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    mp!: number;
  
    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    w!: number;

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    d!: number;

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    l!: number;

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    pt!: number;

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    but!: number;

    @NotEmpty
    @Column({
      type: DataType.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })
    o_but!: number;
  
    @ForeignKey(() => Groupes)
    @AllowNull(true)
    @Column
    groupe_id: number

    @ForeignKey(() => Equipes)
    @AllowNull(true)
    @Column
    equipe_id: number

    @ForeignKey(() => Events)
    @AllowNull(true)
    @Column
    event_id: number
  
    @BelongsTo(() => Groupes)
    groupes: Groupes
    
    @BelongsTo(() => Equipes)
    equipes: Equipes

    @BelongsTo(() => Events)
    events: Events
   
    @HasMany(() => Order_Match)
    order_match: Order_Match[]
  }