import {
    Table,
    Model,
    Column,
    DataType,
    AutoIncrement,
    PrimaryKey,
    NotEmpty,
    AllowNull,
    HasMany,
    ForeignKey,
    BelongsTo,
} from "sequelize-typescript";
import { Equipes } from "./equipe";
import { Events } from "./events";
import { User } from "./user";
@Table({
    timestamps: true,
    tableName: "draw",
})
export class Draw extends Model {
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
    A1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    A2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    B1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    B2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    C1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    C2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    D1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    D2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    E1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    E2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    F1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    F2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    G1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    G2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    H1!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    H2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    A1B2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    B1A2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    C1D2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    D1C2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    E1F2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    F1E2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    G1H2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    H1G2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    A1B2C1D2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    B1A2D1C2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    E1F2G1H2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    F1E2H1G2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    A1B2C1D2E1F2G1H2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    B1A2D1C2F1E2H1G2!: string;

    @AllowNull(true)
    @NotEmpty
    @Column({
        type: DataType.STRING,
    })
    champion!: string;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column
    employee_id: number

    @ForeignKey(() => Events)
    @AllowNull(true)
    @Column
    event_id: number

    @BelongsTo(() => Events)
    events: Events

    @BelongsTo(() => User)
    users: User

}

