export function validateCpf(cpf: string) {
  let Soma;
  let Resto;
  Soma = 0;

  if (cpf === "00000000000") {
    return false;
  }

  for (let i = 1; i <= 9; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (11 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }

  if (Resto !== parseInt(cpf.substring(9, 10), 10)) {
    return false;
  }

  Soma = 0;
  for (let i = 1; i <= 10; i++) {
    Soma += parseInt(cpf.substring(i - 1, i), 10) * (12 - i);
  }

  Resto = (Soma * 10) % 11;

  if (Resto === 10 || Resto === 11) {
    Resto = 0;
  }
  if (Resto !== parseInt(cpf.substring(10, 11), 10)) {
    return false;
  }
  return true;
}

export function generateReferenceCode(type: string): string {
  let letters = type.slice(0, 2).toUpperCase();
  if (letters.length < 3) {
    const randomLetter = String.fromCharCode(
      Math.floor(Math.random() * 26) + 65
    );
    letters += randomLetter.repeat(3 - letters.length);
  }

  const numbers = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, "0");

  return `${letters}-${numbers}`;
}

export function getAreaCodeAndNumber(phoneNumber: string): {
  areaCode: string;
  number: string;
} {
  let areaCode = phoneNumber.slice(0, 2);
  let number = phoneNumber.slice(2);
  return { areaCode, number };
}
