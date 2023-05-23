interface IGenerateDataForm {
  pf_pj: string;
  nome: string;
  email: string;
  cpf: string;
  endereco: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  desc_servicos: string;
  valor_servicos: string;
  grupo: string;
  token: string;
  homologacao_producao: string;
  impostos: string;
  aliquota_issqn: string;
  valor_issqn: string;
  valor_inss: string;
  valor_ir: string;
  valor_pis: string;
  valor_cofins: string;
  valor_csll: string;
  outras_deducoes: string;
  desconto_incondicionado: string;
  codigo_tributacao: string;
  codigo_municipio_tributacao: string;
  reter_issqn: string;
  chc_natureza_operacao: string;
  natureza_operacao_manual: string;
  n_rps: string | number;
  emissao: string;
}

export const generateDataForm = (data: IGenerateDataForm) => {
  return `-----011000010111000001101001\r\nContent-Disposition: form-data; name="grupo"\r\n\r\n${data.grupo}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="token"\r\n\r\n${data.token}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="homologacao_producao"\r\n\r\n${data.homologacao_producao}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="pf_pj"\r\n\r\n${data.pf_pj}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="nome"\r\n\r\n${data.nome}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="cpf"\r\n\r\n${data.cpf}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="endereco"\r\n\r\n${data.endereco}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="bairro"\r\n\r\n${data.bairro}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="cidade"\r\n\r\n${data.cidade}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="estado"\r\n\r\n${data.estado}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="cep"\r\n\r\n${data.cep}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="emissao"\r\n\r\n${data.emissao}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="desc_servicos"\r\n\r\n${data.desc_servicos}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_servicos"\r\n\r\n${data.valor_servicos}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="impostos"\r\n\r\n${data.impostos}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="aliquota_issqn"\r\n\r\n${data.aliquota_issqn}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_issqn"\r\n\r\n${data.valor_issqn}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_inss"\r\n\r\n${data.valor_inss}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_ir"\r\n\r\n${data.valor_ir}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_pis"\r\n\r\n${data.valor_pis}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_cofins"\r\n\r\n${data.valor_cofins}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="valor_csll"\r\n\r\n${data.valor_csll}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="outras_deducoes"\r\n\r\n${data.outras_deducoes}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="desconto_incondicionado"\r\n\r\n${data.desconto_incondicionado}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="codigo_tributacao"\r\n\r\n${data.codigo_tributacao}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="codigo_municipio_tributacao"\r\n\r\n${data.codigo_municipio_tributacao}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="email"\r\n\r\n${data.email}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="reter_issqn"\r\n\r\n${data.reter_issqn}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="chc_natureza_operacao"\r\n\r\n${data.chc_natureza_operacao}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="natureza_operacao_manual"\r\n\r\n${data.natureza_operacao_manual}\r\n-----011000010111000001101001\r\nContent-Disposition: form-data; name="n_rps"\r\n\r\n${data.n_rps}\r\n-----011000010111000001101001--\r\n`;
};

export const nfseStringJSON = (response: string) => {
  const split = response.split(";");
  const status = split[0];
  const numero_nota = split[1];
  const cod_verificacao = split[2];
  const link_xml = split[3];
  const link_2_via = split[4];
  const numero_rps = split[5];
  const object = {
    status,
    numero_nota,
    cod_verificacao,
    link_2_via,
    link_xml,
    numero_rps,
  };
  return object;
  // return JSON.parse(object);
};

// sucesso;
// 16;
// F9131F468C865E9D5373A4F21A3770F8;
// https://www.fluidez.com.br/office/nfse/download_xml?arquivo=724_2022_12_07_07_58_35_pref.xml;
// https://www.fluidez.com.br/office/nfse/nfse_belem/nfse_belem_espelho?codigo_nfse_fluidez=724_F9131F468C865E9D5373A4F21A3770F8;
// 000000038687;
