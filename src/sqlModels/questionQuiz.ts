import { AutoIncrement,
    Column,
    DataType, 
    Model,
    PrimaryKey, 
    Table ,
    AllowNull,
    NotEmpty,
    BelongsTo,
    ForeignKey,
    HasMany,
 } from "sequelize-typescript";
import { sequelize } from "../sequelize";
import { EnumType } from "typescript";
import { Quizs } from "./quiz";
import { responseQuiz } from "./responseQuiz";

@Table({
    timestamps:true,
    tableName:"questionQuiz" ,
})
export class questionQuiz extends Model {
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
        type:DataType.DATE,
        allowNull: false,
    })
    dateStart! : string ;
    @AllowNull(false)
    @NotEmpty
    @Column({
        type:DataType.DATE,
        allowNull: false,
    })
    dateExpiration! : string ;
    @NotEmpty 
    @Column({
        type:DataType.INTEGER,
        allowNull : false,
        defaultValue:1,
     })    
    points!: number ; 
    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.BOOLEAN ,
        allowNull: false,
        defaultValue: false,
    })
    displayedQuestion!: boolean ;
    @AllowNull(false)
    @NotEmpty
    @Column({
        type:DataType.STRING,
        allowNull:false
    })
    questionDescription!:string ;
    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.ENUM("yesNo","list","multiple","oneChoice"),
    })
    type !: EnumType
    /*1 quiz belongs to many question quiz */
    @ForeignKey(() => Quizs)
    @AllowNull(true)
    @Column
    QuizId: number
  

    @BelongsTo(() => Quizs)
    Quizs: Quizs
/*******1 question belongs to many response */ 
@HasMany(() =>responseQuiz)
responseQuiz:responseQuiz[] ;

}