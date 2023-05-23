import axios from "axios";
import { addMinutes } from "date-fns";
import { getAreaCodeAndNumber } from "../utils/roles";
import { IPaymentGatewayService } from "./interfaces/payment-gateway.service";
import {
  IPaymentGatewayServiceCreateOrderRequest,
  IPaymentGatewayServiceCreateOrderResponse,
  IPaymentGatewayServiceStatusResponse,
} from "./payment-gateway.dto";

export class PagarmeGateway implements IPaymentGatewayService {
  async createOrder({
    billing,
    customer,
    installments,
    credit_card,
    payment_method,
    clinic_id,
    service_order_id,
    value,
    service_item_name,
    gateway_api_token,
    service_group_name,
    appointment_id,
  }: IPaymentGatewayServiceCreateOrderRequest): Promise<IPaymentGatewayServiceCreateOrderResponse> {
    try {
      const pagarmeApi = axios.create({
        baseURL: process.env.PAGARME_API_URL,
        headers: {
          accept: "application/json",
          "content-type": "application/json",
          Authorization:
            "Basic " + Buffer.from(`${gateway_api_token}:`).toString("base64"),
        },
      });

      const total_value = value * 100;
      let paymentParams;

      if (payment_method === "credito") {
        paymentParams = {
          credit_card: {
            card: {
              number: credit_card.number,
              holder_name: credit_card.owner_name,
              exp_month: Number(credit_card.expiration_date.split("/")[0]),
              exp_year: Number(credit_card.expiration_date.split("/")[1]),
              cvv: credit_card.cvv,
              billing_address: {
                line_1: `${billing.number}, ${billing.address}, ${billing.neighborhood}`,
                zip_code: billing.zipcode,
                city: billing.city,
                state: billing.state,
                country: billing.country,
              },
            },
            installments,
            statement_descriptor: "DRCLICK AG",
          },
          payment_method: "credit_card",
        };
      }

      if (payment_method === "pix") {
        paymentParams = {
          payment_method: "pix",
          pix: {
            expires_at: addMinutes(new Date(), 30),
            additional_information: [
              {
                name: "Quantidade",
                value: 1,
              },
              {
                name: "Descrição",
                value: service_item_name,
              },
            ],
          },
        };
      }

      const transactionParams = {
        items: [
          {
            amount: total_value,
            description: service_group_name,
            quantity: 1,
            code: appointment_id,
          },
        ],
        customer: {
          phones: {
            mobile_phone: {
              country_code: "55",
              area_code: getAreaCodeAndNumber(customer.phone).areaCode,
              number: getAreaCodeAndNumber(customer.phone).number,
            },
          },
          code: customer.email,
          name: customer.name,
          email: customer.email,
          type: "individual",
          document: customer.document,
        },
        payments: [paymentParams],
      };

      const response = await pagarmeApi.post("/orders", transactionParams);

      const charge =
        response.data.charges.length > 0 ? response.data.charges[0] : null;

      if (!charge) {
        throw new Error("Algo alconteceu na transação");
      }

      console.log("PAGARME :::", response.request);
      return {
        processed_response: JSON.stringify(response.data),
        transaction_id: charge.id,
        status: this.translateTransactionStatus(charge.status),
        card:
          payment_method === "credito"
            ? {
                brand: charge.last_transaction?.card?.brand,
                first_six_digits:
                  charge.last_transaction?.card?.first_six_digits,
                id: charge.last_transaction?.card?.id,
                last_four_digits:
                  charge.last_transaction?.card?.last_four_digits,
              }
            : null,
        pix:
          payment_method === "pix"
            ? {
                code: charge.last_transaction.qr_code,
                qr_code_url: charge.last_transaction.qr_code_url,
                expiration_date: charge.last_transaction.expires_at,
              }
            : null,
      };
    } catch (error) {
      console.log("Error gateway", error);
      if (error.response) {
        console.log("Error", error.response.data);
        console.log("Error", error.response.data.errors);
      }
    }
  }

  translateTransactionStatus(
    status:
      | "paid"
      | "canceled"
      | "processing"
      | "pending"
      | "failed"
      | "overpaid"
      | "underpaid"
      | "chargedback"
  ): IPaymentGatewayServiceStatusResponse {
    if (status === "paid") {
      return "aprovada";
    }
    const statusMap = {
      paid: "aprovada",
      canceled: "recusada",
      pending: "pendente",
      processing: "processando",
      failed: "error",
      overpaid: "devolvida",
      underpaid: "devolvida",
      chargedback: "estorno",
    };

    return statusMap[status] as IPaymentGatewayServiceStatusResponse;
  }
}
