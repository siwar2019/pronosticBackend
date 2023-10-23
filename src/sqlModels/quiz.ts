import { AutoIncrement,
    Column,
    DataType, 
    Model,
    PrimaryKey, 
    Table ,
    AllowNull,
    NotEmpty,
    BelongsToMany,
    HasMany,
 } from "sequelize-typescript";

import {questionQuiz} from "../sqlModels/questionQuiz";


@Table({
    timestamps:true,
    tableName:"quizs" ,
})
export class Quizs extends Model {
   @AutoIncrement
   @PrimaryKey
   @Column({
    type:DataType.INTEGER,
    allowNull:false,
   }) 
   id!: number ;
   @AllowNull(false)
   @NotEmpty
   @Column({
       type:DataType.STRING,
       allowNull:false
   })
   nom!:string ;
    @AllowNull(false)
    @NotEmpty
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    category!:string ;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    description!:string

    @AllowNull(true)
    @Column({
      type: DataType.STRING,
      allowNull: false,
    })
    image!: string;

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.BOOLEAN ,
        allowNull: false,
        defaultValue: false,
    })
    isDisplayedByPartner!: boolean ;


    @HasMany(() => questionQuiz)
    questionQuiz: questionQuiz[];

}