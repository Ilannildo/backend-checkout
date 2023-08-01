import { Request, Response } from "express";
import { AppDataSource } from "../../../config/database";
import { CompanyModel } from "../../../entity/Company";
import {
  LogTransactionModel,
  TRANSACTION_STATUS,
} from "../../../entity/LogTransaction";
import { CreateTransactionProvider } from "../../../providers/create-transaction.provider";
import { HttpStatus } from "../../../utils/constants/httpStatus";
import { Codes } from "../../../utils/formatters/codes";
import { sendError, sendSuccessful } from "../../../utils/formatters/responses";
import { IPayServiceOrderResponse } from "./company.dto";

const companyDataSource = AppDataSource.getRepository(CompanyModel);
const logTransactionDataSource =
  AppDataSource.getRepository(LogTransactionModel);

const createTransactionProvider = new CreateTransactionProvider();
export const payServiceOrder = async (req: Request, response: Response) => {
  try {
    // recebe o body da requisição
    const {
      payment_method,
      installments,
      customer_document,
      customer_phone_number,
      customer_name,
      customer_email,
      billing_city,
      billing_address,
      billing_number,
      billing_neighborhood,
      billing_state,
      billing_zipcode,
      credit_card_number,
      credit_card_owner_name,
      credit_card_expiration_date,
      credit_card_cvv,
      clinic_id,
      value,
      service_item_name,
      service_group_name,
      appointment_id,
      service_package_id,
      debit,
      is_combo,
    } = req.body;

    console.log("BODY ::", req.body);

    const company = await companyDataSource.findOne({
      where: {
        idclinica_sistema: clinic_id,
      },
    });

    if (!company) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        "Essa clínica não pode receber pagamentos no momento. Tente mais tarde!",
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const API_KEY = company.producao
      ? company.token_producao
      : company.token_homogacao;

    const transaction = await createTransactionProvider.execute({
      billing: {
        address: billing_address,
        city: billing_city,
        country: "BR",
        neighborhood: billing_neighborhood,
        number: billing_number,
        state: billing_state,
        zipcode: billing_zipcode,
      },
      customer: {
        document: customer_document,
        email: customer_email,
        name: customer_name,
        phone: customer_phone_number,
      },
      installments,
      payment_method: payment_method,
      credit_card: {
        cvv: credit_card_cvv,
        expiration_date: credit_card_expiration_date,
        number: credit_card_number,
        owner_name: credit_card_owner_name,
      },
      clinic_id,
      value,
      appointment_id,
      gateway_api_token: API_KEY,
      service_item_name,
      service_group_name,
      service_package_id,
      is_combo,
      debit,
    });

    if (!transaction) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        "Ocorreu um erro ao efetuar o pagamento. Tente novamente!",
        HttpStatus.NOT_FOUND
      );
    }

    if (
      (payment_method === "transferencia" || payment_method === "pix") &&
      transaction.order.status === "pendente"
    ) {
      const paymentPixResponse: IPayServiceOrderResponse = {
        payment_method: "pix",
        order_id: transaction.order.transaction_id,
        status: transaction.order.status,
        expires_at: transaction.order.pix.expiration_date,
        qr_code: transaction.order.pix.code,
        qr_code_url: transaction.order.pix.qr_code_url,
      };
      return sendSuccessful(
        response,
        {
          transaction: transaction,
          payment_response: paymentPixResponse,
        },
        HttpStatus.OK
      );
    }

    const messageErrorGatewayAprovedDefault = "Transação aprovada com sucesso";
    const messageErrorGatewayAprovedRepleced = "Transação não autorizada";
    
    const paymentPixResponse: IPayServiceOrderResponse = {
      payment_method: payment_method,
      status: transaction.order.status,
      order_id: transaction.order.transaction_id,
      error_message:
        transaction.order.error_message &&
        (transaction.order.error_message ===
          messageErrorGatewayAprovedDefault ||
          transaction.order.error_message.toLowerCase().includes("sucesso"))
          ? messageErrorGatewayAprovedRepleced
          : transaction.order.error_message,
    };

    return sendSuccessful(
      response,
      {
        transaction: transaction,
        payment_response: paymentPixResponse,
      },
      HttpStatus.OK
    );
  } catch (error) {
    return sendError(
      response,
      Codes.UNKNOWN_ERROR,
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const closeServiceOrder = async (req: Request, response: Response) => {
  const { order_id } = req.params;

  try {
    const service_order = await logTransactionDataSource.findOne({
      where: {
        idtransacao_gateway: order_id,
      },
    });

    if (!service_order) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        "ErrorAo fechar a ordem de serviço",
        HttpStatus.NOT_FOUND
      );
    }

    service_order.status = TRANSACTION_STATUS.refused;
    await logTransactionDataSource.save(service_order);

    return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
  } catch (error) {
    return sendError(
      response,
      Codes.UNKNOWN_ERROR,
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const updateServiceOrder = async (req: Request, response: Response) => {
  const { order_id } = req.params;
  const { status, processed_response } = req.body;
  try {
    const service_order = await logTransactionDataSource.findOne({
      where: {
        idtransacao_gateway: order_id,
      },
    });

    if (!service_order) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        "ErrorAo fechar a ordem de serviço",
        HttpStatus.NOT_FOUND
      );
    }

    service_order.status = status;
    service_order.response_processado = processed_response;
    await logTransactionDataSource.save(service_order);

    return sendSuccessful(response, {}, HttpStatus.NO_CONTENT);
  } catch (error) {
    return sendError(
      response,
      Codes.UNKNOWN_ERROR,
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};

export const getServiceOrder = async (req: Request, response: Response) => {
  const { order_id } = req.params;
  try {
    const service_order = await logTransactionDataSource.findOne({
      where: {
        idtransacao_gateway: order_id,
      },
    });

    if (!service_order) {
      return sendError(
        response,
        Codes.UNKNOWN_ERROR,
        "ErrorAo fechar a ordem de serviço",
        HttpStatus.NOT_FOUND
      );
    }

    return sendSuccessful(response, service_order, HttpStatus.OK);
  } catch (error) {
    return sendError(
      response,
      Codes.UNKNOWN_ERROR,
      error.message,
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
};
