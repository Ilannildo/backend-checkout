import { Request, Response, Router } from "express";
import * as company from "../modules/company/controllers/company.controller";
import * as companyValidation from "../modules/company/validations/company.validation";

export const router = Router();

router
  .route("/api/service-orders/payment")
  .post(companyValidation.pay, (req: Request, res: Response) =>
    company.payServiceOrder(req, res)
  );

router
  .route("/api/service-orders/:order_id/close")
  .post((req: Request, res: Response) => company.closeServiceOrder(req, res));

router
  .route("/api/service-orders/:order_id")
  .get((req: Request, res: Response) => company.getServiceOrder(req, res))
  .put((req: Request, res: Response) => company.updateServiceOrder(req, res));
