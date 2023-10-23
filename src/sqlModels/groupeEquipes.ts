import {
    Table,
    Model,
    Column,
    ForeignKey,
} from "sequelize-typescript";
import { Equipes } from "./equipe";
import { Groupes } from "./groupes";
@Table({
    timestamps: true,
    tableName: "groupes_equipes",
})
export class GroupeEquipes extends Model {
    @ForeignKey(() => Groupes)
    @Column
    groupe_id: number

    @ForeignKey(() => Equipes)
    @Column
    equipe_id: number
}
