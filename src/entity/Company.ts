import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogTransactionModel } from "./LogTransaction";

@Entity()
export class CompanyModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  idempresa: string;

  @Column("varchar")
  idclinica_sistema: string;

  @Column("varchar")
  token_producao: string;

  @Column("varchar")
  token_homogacao: string;

  @Column("varchar")
  producao: boolean;

  @Column("varchar")
  nomeempresa: string;

  @Column("varchar", { nullable: true })
  email: string;

  @OneToMany(() => LogTransactionModel, (log) => log.company)
  logs_transacao: LogTransactionModel[];
}
