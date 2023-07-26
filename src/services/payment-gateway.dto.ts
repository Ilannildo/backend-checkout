export interface IPaymentGatewayServiceCreateOrderRequest {
  payment_method: "credito" | "cartao" | "pix" | "transferencia";
  appointment_id?: string;
  service_package_id?: string;
  is_combo?: boolean;
  debit?: boolean;
  clinic_id: string;
  service_item_name: string;
  service_group_name: string;
  gateway_api_token: string;
  value: number;
  installments: number;
  credit_card?: {
    number: string;
    cvv: string;
    owner_name: string;
    expiration_date: string;
  };
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
}

export interface IPaymentGatewayServiceCreateOrderResponse {
  transaction_id: string;
  status: IPaymentGatewayServiceStatusResponse;
  processed_response: string;
  error_message?: string;
  card?: {
    id: string;
    first_six_digits: string;
    last_four_digits: string;
    brand: string;
  };
  pix?: {
    code: string;
    qr_code_url: string;
    expiration_date: Date;
  };
}

export type IPaymentGatewayServiceStatusResponse =
  | "iniciada"
  | "processando"
  | "pendente"
  | "aprovada"
  | "recusada"
  | "devolvida"
  | "estorno"
  | "error";
