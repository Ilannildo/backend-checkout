import { AppDataSource } from "../config/database";
import { CompanyModel } from "../entity/Company";
import { LogTransactionModel } from "../entity/LogTransaction";
import { PagarmeGateway } from "../services/pagarme-gateway.service";

interface ICreateTransactionRepository {
  payment_method: "credito" | "cartao" | "pix" | "transferencia";
  installments: number;
  value: number;
  is_combo?: boolean;
  clinic_id: string;
  service_item_name: string;
  service_group_name: string;
  gateway_api_token: string;
  appointment_id?: string;
  service_package_id?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    document: string;
  };
  billing: {
    address: string;
    number: string;
    neighborhood: string;
    city: string;
    country: string;
    zipcode: string;
    state: string;
  };
  credit_card?: {
    number: string;
    cvv: string;
    owner_name: string;
    expiration_date: string;
  };
}

const logTransactionDataSource =
  AppDataSource.getRepository(LogTransactionModel);
const paymentGatewayService = new PagarmeGateway();

export class CreateTransactionProvider {
  async execute({
    customer,
    payment_method,
    billing,
    installments,
    credit_card,
    value,
    clinic_id,
    appointment_id,
    gateway_api_token,
    service_item_name,
    service_group_name,
    service_package_id,
    is_combo
  }: ICreateTransactionRepository) {
    try {
      const newTransaction = new LogTransactionModel();
      newTransaction.documento_cliente = customer.document;
      newTransaction.email_cliente = customer.email;
      newTransaction.nome_cliente = customer.name;
      newTransaction.telefone_cliente = customer.phone;
      newTransaction.metodopagamento = payment_method;
      newTransaction.idagendamento = appointment_id;
      newTransaction.status = "iniciada";
      newTransaction.endereco_cliente = billing.address;
      newTransaction.cidade_cliente = billing.city;
      newTransaction.bairro_cliente = billing.neighborhood;
      newTransaction.numero_cliente = billing.number;
      newTransaction.estado_cliente = billing.state;
      newTransaction.cep_cliente = billing.zipcode;

      const transaction = await logTransactionDataSource.save(newTransaction);

      const order = await paymentGatewayService.createOrder({
        customer,
        payment_method,
        billing,
        installments,
        credit_card,
        clinic_id,
        appointment_id,
        value,
        gateway_api_token,
        service_item_name,
        service_group_name,
        service_package_id,
        is_combo
      });

      transaction.idtransacao_gateway = order.transaction_id;
      transaction.response_processado = order.processed_response;
      transaction.status = order.status;

      const transactionUpdate = await logTransactionDataSource.save(
        transaction
      );

      delete order.processed_response;
      return { transactionUpdate, order };
    } catch (error) {
      console.log("Error transaction :::", error);
    }
  }
}
