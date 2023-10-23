import { AutoIncrement,
    Column,
    DataType, 
    Model,
    PrimaryKey, 
    Table ,
    AllowNull,
    NotEmpty,
    ForeignKey,
    BelongsTo,
 } from "sequelize-typescript";
import { sequelize } from "../sequelize";
import { EnumType } from "typescript";
import { questionQuiz } from "./questionQuiz";

@Table({
    timestamps:true,
    tableName:"responseQuiz" ,
})
export class responseQuiz extends Model {
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
        //type: DataType.ARRAY(DataType.STRING),
        type: DataType.STRING,

        allowNull:false
    })
    
    response!:any
/*

    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.ARRAY(DataType.JSON),
        allowNull:false
    })
    response!:Array<any> ;
*/
    @AllowNull(false)
    @NotEmpty
    @Column({
        type: DataType.BOOLEAN ,
        allowNull: false,
        defaultValue: false,
    })
    isCorrectAnswer!: boolean ;
    
    @ForeignKey(() => questionQuiz)
    @AllowNull(true)
    @Column
    questionId:number
    
    @BelongsTo(() =>questionQuiz)
    questionQuiz:questionQuiz


}