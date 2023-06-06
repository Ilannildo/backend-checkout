import { CustomValidator, body, param } from "express-validator";
import { parsePhoneNumber } from "libphonenumber-js";
import { HttpStatus } from "../../../utils/constants/httpStatus";
import { Codes } from "../../../utils/formatters/codes";
import middlewareValidation from "../../../utils/middlewares/validations";
import { validateCpf } from "../../../utils/roles";

const isValidCpf: CustomValidator = (value) => {
  const result = validateCpf(value);
  if (!result) {
    throw new Error("O CPF é inválido");
  }
  return true;
};

const isValidPhoneNumber: CustomValidator = (value) =>
  parsePhoneNumber(value, "BR").isValid();

export const pay = [
  body("payment_method")
    .if(body("is_free").equals("false"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O método de pagamento é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("installments")
    .not()
    .isEmpty()
    .withMessage({
      message: "A parcela é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .isNumeric()
    .withMessage({
      message: "A parcela está em um formato inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("customer_document")
    .not()
    .isEmpty()
    .withMessage({
      message: "O documento do paciente é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .custom(isValidCpf)
    .withMessage({
      message: "Informe um CPF válido",
      code: Codes.AUTH__INVALID_CPF,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("customer_email").not().isEmpty().withMessage({
    message: "O email do paciente é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("customer_name").not().isEmpty().withMessage({
    message: "O nome do paciente é obrigatório",
    code: Codes.DOCUMENT__NOT_FOUND,
    status: HttpStatus.UNPROCESSABLE_ENTITY,
  }),
  body("customer_phone_number")
    .not()
    .isEmpty()
    .withMessage({
      message: "O número de telefone é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    })
    .custom(isValidPhoneNumber)
    .withMessage({
      message: "O número de telefone é inválido",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_number")
    .if(body("payment_method").equals("credito"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O número do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_expiration_date")
    .if(body("payment_method").equals("credito"))
    .not()
    .isEmpty()
    .withMessage({
      message: "A data de expiração do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_cvv")
    .if(body("payment_method").equals("credito"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O CVV do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  body("credit_card_owner_name")
    .if(body("payment_type").equals("credito"))
    .not()
    .isEmpty()
    .withMessage({
      message: "O nome do titular do cartão é obrigatório",
      code: Codes.DOCUMENT__NOT_FOUND,
      status: HttpStatus.UNPROCESSABLE_ENTITY,
    }),
  middlewareValidation,
];
