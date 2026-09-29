export const tenants = {
  proxy: {
    id: "proxy",
    brand: "ATLAS INDUSTRIAL",
    productName: "Proxy Relationship Intelligence",
    subtitle: "Relacionamento, comunicação e inteligência comercial em um único ambiente.",
    demoLabel: "Ambiente demonstrativo · empresa e dados fictícios",
    initials: "AT",
    publicDemo: true,
    accent: "#355c63",
    accentSoft: "#eaf0f1",
    companyDescription:
      "Empresa demonstrativa B2B de soluções industriais, serviços técnicos e projetos.",
    emailTagline: "INFORMAÇÃO · OPERAÇÃO · RELACIONAMENTO",
    emailBody:
      "Conteúdo técnico, oportunidades, serviços e informações úteis para manter o relacionamento comercial ativo.",
    linkedinDescription: "Soluções industriais, serviços técnicos e projetos B2B",
    hashtags: "#Indústria #Tecnologia #RelacionamentoB2B",
    featureHeadline:
      "Informação, oportunidades e atendimento podem virar relacionamento mensurável.",
    featureBody:
      "A mesma operação que informa o mercado registra interesse, organiza contatos e entrega contexto para o time comercial.",
    relationLabel: "RELAÇÃO COM A EMPRESA",
    ticker: [
      ["MERCADO", "MONITORAMENTO"],
      ["CARTEIRA", "OPORTUNIDADES"],
      ["E-MAIL", "RELACIONAMENTO"],
      ["WHATSAPP", "ATENDIMENTO"],
      ["CONTEÚDO", "INTELIGÊNCIA"],
      ["EVENTOS", "AGENDA"],
    ],
  },

  texfield: {
    id: "texfield",
    brand: "TEXFIELD",
    productName: "Central de Relacionamento",
    subtitle: "Comunicação comercial organizada em um único ambiente.",
    demoLabel: "Ambiente demonstrativo · dados ilustrativos",
    initials: "TX",
    publicDemo: false,
    accent: "#173f5f",
    accentSoft: "#eaf0f5",
    companyDescription:
      "Representação e fornecimento de máquinas, peças e soluções para a indústria têxtil.",
    emailTagline: "INFORMAÇÃO · TECNOLOGIA · INDÚSTRIA",
    emailBody:
      "Máquinas, componentes, assistência e tecnologia para apoiar a operação industrial e manter o relacionamento comercial ativo.",
    linkedinDescription: "Máquinas, peças e soluções para a indústria têxtil",
    hashtags: "#IndústriaTêxtil #Tecnologia #Produtividade",
    featureHeadline:
      "Máquinas, peças e oportunidades podem virar relacionamento mensurável.",
    featureBody:
      "A mesma operação que informa o mercado registra interesse, organiza contatos e entrega contexto para o time comercial.",
    relationLabel: "RELAÇÃO COM A TEXFIELD",
    ticker: [
      ["ALGODÃO", "MONITORAMENTO"],
      ["USD / BRL", "CÂMBIO"],
      ["EUR / BRL", "CÂMBIO"],
      ["INDÚSTRIA TÊXTIL", "OPORTUNIDADES"],
      ["FEIRAS & EVENTOS", "AGENDA 2026"],
      ["PEÇAS & SERVIÇOS", "RELACIONAMENTO"],
    ],
  },
};

export function getTenant(slug) {
  return tenants[slug] || tenants.proxy;
}

export const activeTenant = tenants.proxy;
