import { Request, Response, Router } from "express";
import * as company from "../modules/company/controllers/company.controller";
import * as companyValidation from "../modules/company/validations/company.validation";

export const router = Router();

router
  .route("/api/service-orders/:service_order_id/payment")
  .post(companyValidation.pay, (req: Request, res: Response) =>
    company.payServiceOrder(req, res)
  );
