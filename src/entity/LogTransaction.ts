import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { CompanyModel } from "./Company";

export enum TRANSACTION_STATUS {
  started = "iniciada",
  processing = "processando",
  pending = "pendente",
  approved = "aprovada",
  refused = "recusada",
  refunded = "devolvida",
  chargeback = "estorno",
  error = "error",
}

@Entity()
export class LogTransactionModel extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  idlogtransacao: string;

  @Column("text", { nullable: true })
  response_processado?: string;

  @Column("varchar", { nullable: true })
  idtransacao_gateway: string;

  @Column("varchar")
  metodopagamento: string;

  @Column("boolean", { default: false })
  debito: boolean;

  @Column("varchar", { nullable: true })
  idagendamento?: string;

  @Column("varchar")
  email_cliente: string;
  @Column("varchar")
  nome_cliente: string;
  @Column("varchar")
  telefone_cliente: string;
  @Column("varchar")
  documento_cliente: string;
  @Column("varchar")
  endereco_cliente: string;
  @Column("varchar")
  numero_cliente: string;
  @Column("varchar")
  bairro_cliente: string;
  @Column("varchar")
  cidade_cliente: string;
  @Column("varchar")
  estado_cliente: string;
  @Column("varchar")
  cep_cliente: string;
  @Column("varchar", { default: TRANSACTION_STATUS.started })
  status:
    | "iniciada"
    | "processando"
    | "pendente"
    | "aprovada"
    | "recusada"
    | "devolvida"
    | "estorno"
    | "error";

  @ManyToOne(() => CompanyModel, (company) => company.logs_transacao)
  company: CompanyModel;

  @CreateDateColumn()
  createdDate: Date;

  @UpdateDateColumn()
  updatedDate: Date;
}
