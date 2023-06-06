export interface IPayServiceOrderResponse {
  payment_method?: "credito" | "pix";
  status:
    | "iniciada"
    | "processando"
    | "pendente"
    | "aprovada"
    | "recusada"
    | "devolvida"
    | "estorno"
    | "error";
  qr_code_url?: string;
  order_id?: string;
  error_message?: string;
  is_free?: boolean;
  qr_code?: string;
  expires_at?: Date;
}
