import {
  IPaymentGatewayServiceCreateOrderRequest,
  IPaymentGatewayServiceCreateOrderResponse,
} from "../payment-gateway.dto";

export interface IPaymentGatewayService {
  createOrder(
    data: IPaymentGatewayServiceCreateOrderRequest
  ): Promise<IPaymentGatewayServiceCreateOrderResponse>;
}
