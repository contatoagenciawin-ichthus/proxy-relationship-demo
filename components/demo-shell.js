"use client";

import { useEffect, useMemo, useState } from "react";

const navItems = [
  ["overview", "Visão geral"],
  ["email", "E-mail"],
  ["contacts", "Contatos"],
  ["whatsapp", "WhatsApp"],
  ["reports", "Inteligência"],
];

const campaigns = [
  {
    id: 1,
    title: "Urdideira Jupiter: tecnologia em operação",
    segment: "Preparação e tecelagem",
    audience: 382,
    delivered: 371,
    clicks: 47,
    status: "sent",
    statusLabel: "SENT",
    ctr: "12,3%",
  },
  {
    id: 2,
    title: "Novidades Texfield",
    segment: "Base comercial ativa",
    audience: 624,
    delivered: 608,
    clicks: 92,
    status: "live",
    statusLabel: "LIVE",
    ctr: "14,7%",
  },
  {
    id: 3,
    title: "Peças, assistência e reposição",
    segment: "Pós-venda",
    audience: 196,
    delivered: 191,
    clicks: 31,
    status: "sent",
    statusLabel: "SENT",
    ctr: "15,8%",
  },
];

const contacts = [
  ["Tecelagem Horizonte", "Cliente", "Máquinas", "Americana · SP", "Ativo", "Hoje, 10:42"],
  ["Malharia Santa Clara", "Prospect", "Peças", "Brusque · SC", "Oportunidade", "Hoje, 10:18"],
  ["Fiação Industrial Sul", "Cliente", "Assistência", "Blumenau · SC", "Ativo", "Ontem"],
  ["Têxtil Nova Era", "Prospect", "Máquinas", "São Paulo · SP", "Em contato", "Ontem"],
  ["Confecções Aurora", "Cliente", "Componentes", "Goiânia · GO", "Ativo", "22 set"],
];

const conversations = [
  {
    company: "Malharia Santa Clara",
    message: "Precisamos cotar um conjunto de peças para uma máquina circular.",
    category: "Peças",
    priority: "Alta",
    owner: "Robert",
    time: "10:42",
  },
  {
    company: "Fiação Industrial Sul",
    message: "Temos uma dúvida técnica sobre o equipamento instalado.",
    category: "Suporte",
    priority: "Normal",
    owner: "Equipe técnica",
    time: "09:18",
  },
  {
    company: "Têxtil Nova Era",
    message: "Gostaria de receber informações sobre máquinas disponíveis.",
    category: "Comercial",
    priority: "Alta",
    owner: "Comercial",
    time: "Ontem",
  },
];

const activity = [
  ["11:31", "Malharia Santa Clara abriu campanha", "Interesse detectado em peças e reposição", "E-MAIL"],
  ["11:27", "Nova conversa recebida", "Solicitação comercial direcionada para atendimento prioritário", "WHATSAPP"],
  ["11:18", "Têxtil Nova Era clicou em equipamento", "Contato marcado para acompanhamento comercial", "SINAL"],
  ["10:54", "Campanha entregue", "Novo lote de mensagens aceito pelo provedor", "E-MAIL"],
  ["10:41", "Contato atualizado", "Interesse principal alterado para máquinas", "CRM"],
];

const signals = [
  ["Máquinas", 42],
  ["Peças", 31],
  ["Assistência", 17],
  ["Outros", 10],
];

const radarSources = [
  ["ABIT", "Mercado brasileiro, inovação e sustentabilidade", "MONITORADA"],
  ["Febratex", "Tecnologia, máquinas, produtividade e eventos", "MONITORADA"],
  ["ITMF", "Indústria global, fibras, produção e comércio", "MONITORADA"],
  ["Fabricantes", "Lançamentos, aplicações e suporte técnico", "CURADORIA"],
  ["Mercado", "Algodão, câmbio e sinais econômicos", "INDICADORES"],
  ["Feiras & eventos", "Agenda setorial e oportunidades comerciais", "AGENDA"],
];

const radarTopics = [
  {
    id: "automacao",
    relevance: "ALTA",
    trend: "EM DESTAQUE",
    title: "Automação e produtividade",
    summary:
      "Como reduzir gargalos, integrar processos e avaliar ganhos reais de produtividade.",
    sources: ["Febratex", "ABIT", "Fabricantes"],
    audience: "Gestores industriais / produção",
    relation: "Máquinas · produtividade · assistência",
    angle:
      "Ir além da velocidade nominal e discutir estabilidade, setup, manutenção, disponibilidade de peças e suporte.",
    articleTitle:
      "Automação resolve tudo? O que realmente aumenta a produtividade de uma operação têxtil",
    objective: "Educação + relacionamento",
    outline: [
      "O que normalmente é chamado de produtividade",
      "Onde a operação perde eficiência sem perceber",
      "O papel da automação e da integração de processos",
      "O que avaliar antes de escolher um equipamento",
      "Por que manutenção, peças e suporte entram na conta",
    ],
  },
  {
    id: "ia-industria",
    relevance: "ALTA",
    trend: "CRESCENTE",
    title: "IA e Indústria 4.0",
    summary:
      "Aplicações práticas de dados, automação e inteligência na operação têxtil.",
    sources: ["Febratex", "ITMF", "Fabricantes"],
    audience: "Direção industrial / engenharia",
    relation: "Tecnologia · integração · modernização",
    angle:
      "Separar promessa de aplicação prática e mostrar onde dados e automação podem apoiar decisões de produção.",
    articleTitle:
      "IA na indústria têxtil: onde a tecnologia já pode apoiar a operação",
    objective: "Educação + posicionamento",
    outline: [
      "Por que IA virou pauta industrial",
      "Onde dados já ajudam a produção",
      "Automação, integração e tomada de decisão",
      "O que exige infraestrutura e processo",
      "Como avaliar tecnologias sem seguir apenas o hype",
    ],
  },
  {
    id: "impressao",
    relevance: "MÉDIA",
    trend: "EM MOVIMENTO",
    title: "Impressão digital e produção sob demanda",
    summary:
      "Flexibilidade, personalização e resposta mais rápida a lotes e demandas variáveis.",
    sources: ["Febratex", "Fabricantes"],
    audience: "Produção / desenvolvimento de produto",
    relation: "Tecnologia · flexibilidade · novos processos",
    angle:
      "Explicar onde impressão digital amplia flexibilidade sem reduzir a decisão a uma única tecnologia.",
    articleTitle:
      "Produção sob demanda: onde a impressão digital muda a lógica da operação",
    objective: "Educação",
    outline: [
      "O que está mudando na demanda",
      "Flexibilidade e personalização",
      "Tecnologias e contextos de uso",
      "Impactos em prazo e planejamento",
      "O que observar antes de investir",
    ],
  },
  {
    id: "manutencao",
    relevance: "ALTA",
    trend: "RECORRENTE",
    title: "Máquina não é só velocidade",
    summary:
      "Manutenção, estabilidade, disponibilidade de peças e suporte como parte da produtividade.",
    sources: ["Fabricantes", "Febratex"],
    audience: "Gestores industriais / manutenção",
    relation: "Peças · assistência · pós-venda",
    angle:
      "Transformar pós-venda em pauta de gestão: custo de parada, previsibilidade e suporte técnico.",
    articleTitle:
      "Máquina rápida, operação parada: por que suporte e peças também definem produtividade",
    objective: "Educação + comercial",
    outline: [
      "Velocidade nominal versus produtividade real",
      "O custo invisível das paradas",
      "Peças e manutenção como fatores de decisão",
      "A importância do suporte técnico",
      "Como comparar equipamentos de forma mais completa",
    ],
  },
  {
    id: "rastreabilidade",
    relevance: "MÉDIA",
    trend: "ESTRATÉGICO",
    title: "Rastreabilidade e circularidade",
    summary:
      "Novos materiais, pressão por eficiência de recursos e maior visibilidade sobre a cadeia.",
    sources: ["ABIT", "ITMF", "Febratex"],
    audience: "Direção / sustentabilidade / compras",
    relation: "Mercado · cadeia · posicionamento",
    angle:
      "Tratar sustentabilidade como operação e rastreabilidade, e não apenas como discurso institucional.",
    articleTitle:
      "Rastreabilidade têxtil: por que o tema está deixando de ser apenas institucional",
    objective: "Educação + posicionamento",
    outline: [
      "Por que rastreabilidade ganhou importância",
      "O que a indústria precisa enxergar na cadeia",
      "Circularidade e eficiência de recursos",
      "Dados, processo e fornecedores",
      "Como transformar exigência em vantagem operacional",
    ],
  },
  {
    id: "mercado",
    relevance: "MÉDIA",
    trend: "ACOMPANHAR",
    title: "Mercado e oportunidades internacionais",
    summary:
      "Câmbio, feiras, movimentos da cadeia e novas oportunidades para empresas do setor.",
    sources: ["ABIT", "ITMF", "Feiras & eventos"],
    audience: "Direção / comercial",
    relation: "Mercado · representação · oportunidades",
    angle:
      "Usar sinais do setor para criar contato recorrente e útil com clientes, sem transformar a comunicação em propaganda.",
    articleTitle:
      "O que acompanhar no mercado têxtil antes da próxima decisão de investimento",
    objective: "Relacionamento + autoridade",
    outline: [
      "Quais sinais merecem acompanhamento",
      "Câmbio, matéria-prima e investimento",
      "Feiras e lançamentos",
      "Movimentos internacionais relevantes",
      "Como transformar informação em decisão",
    ],
  },
];


const radarChannelCopy = {
  automacao: {
    email: {
      eyebrow: "PRODUTIVIDADE INDUSTRIAL",
      subject: "Automação resolve tudo? O que realmente aumenta a produtividade",
      preheader: "Velocidade é apenas uma parte da equação. Setup, estabilidade, manutenção e suporte também contam.",
      headline: "Produtividade não é apenas produzir mais rápido.",
      body:
        "Ao avaliar automação, vale olhar para o conjunto da operação: estabilidade, tempo de setup, manutenção, disponibilidade de peças e suporte técnico. É essa combinação que transforma capacidade instalada em produção previsível.",
      cta: "Ler análise completa",
    },
    whatsapp: {
      intro: "Olá. Separamos uma pauta que tem aparecido cada vez mais nas discussões do setor:",
      highlight: "Automação e produtividade não são sinônimos.",
      body:
        "Uma máquina mais rápida pode não entregar o ganho esperado quando setup, manutenção, peças e suporte criam gargalos na operação.",
      cta: "Quer receber a análise completa?",
    },
    linkedin: {
      headline: "Automação industrial: produtividade começa antes da velocidade da máquina.",
      body:
        "A discussão sobre automação na indústria têxtil costuma começar pela capacidade dos equipamentos. Mas produtividade sustentada depende também de estabilidade, setup, manutenção, disponibilidade de peças e suporte. Avaliar tecnologia por esse conjunto ajuda a aproximar investimento de resultado operacional.",
      footer: "Tecnologia, operação e suporte precisam ser avaliados juntos.",
    },
  },
  "ia-industria": {
    email: {
      eyebrow: "IA + INDÚSTRIA 4.0",
      subject: "IA na indústria têxtil: onde a tecnologia já pode apoiar a operação",
      preheader: "Menos promessa, mais aplicação prática em dados, integração e decisão.",
      headline: "IA industrial começa com processo e dados confiáveis.",
      body:
        "Antes de pensar em automação inteligente, a empresa precisa enxergar o processo. Dados de produção, integração entre equipamentos e critérios claros de decisão são a base para usar IA com utilidade operacional.",
      cta: "Ver aplicações práticas",
    },
    whatsapp: {
      intro: "Um tema que está ganhando espaço no setor:",
      highlight: "IA na indústria têxtil.",
      body:
        "O ponto não é simplesmente adicionar IA à operação. O valor aparece quando dados, equipamentos e processo estão conectados para apoiar decisões reais.",
      cta: "Posso te enviar um resumo com aplicações práticas?",
    },
    linkedin: {
      headline: "IA na indústria têxtil: o desafio não é usar IA. É criar contexto para ela.",
      body:
        "Dados fragmentados, processos desconectados e pouca visibilidade operacional limitam qualquer iniciativa de inteligência. Na prática, a transformação começa pela integração: entender o processo, organizar dados e então aplicar automação e IA onde existe uma decisão concreta a melhorar.",
      footer: "Indústria 4.0 é integração antes de ser ferramenta.",
    },
  },
  impressao: {
    email: {
      eyebrow: "IMPRESSÃO DIGITAL",
      subject: "Produção sob demanda: onde a impressão digital muda a lógica da operação",
      preheader: "Flexibilidade, personalização e resposta mais rápida a lotes variáveis.",
      headline: "Produzir diferente pode ser mais importante do que produzir mais.",
      body:
        "A impressão digital amplia possibilidades de personalização, reduz barreiras para lotes menores e encurta a resposta a novas demandas. O ganho, porém, depende de entender onde essa flexibilidade se encaixa no processo produtivo.",
      cta: "Explorar o tema",
    },
    whatsapp: {
      intro: "Uma mudança importante na lógica de produção:",
      highlight: "mais flexibilidade para lotes e personalização.",
      body:
        "A impressão digital pode ajudar operações que precisam responder a volumes menores, variedade maior e ciclos mais curtos.",
      cta: "Quer ver os pontos que merecem atenção antes de investir?",
    },
    linkedin: {
      headline: "Produção sob demanda está mudando a conversa sobre impressão têxtil.",
      body:
        "Personalização, variedade e ciclos menores estão pressionando a indústria por mais flexibilidade. A impressão digital entra nesse contexto não apenas como tecnologia de estamparia, mas como ferramenta para redesenhar prazos, lotes e planejamento.",
      footer: "Flexibilidade também é uma variável de produtividade.",
    },
  },
  manutencao: {
    email: {
      eyebrow: "PÓS-VENDA + PRODUTIVIDADE",
      subject: "Máquina rápida, operação parada: por que suporte e peças também definem produtividade",
      preheader: "O custo de uma máquina não termina na compra. A disponibilidade operacional precisa entrar na conta.",
      headline: "A melhor máquina é a que continua produzindo.",
      body:
        "Desempenho técnico importa, mas uma operação produtiva também depende de manutenção, disponibilidade de peças e suporte. Quando esses fatores entram na análise, o investimento deixa de ser apenas aquisição de equipamento e passa a ser decisão de continuidade operacional.",
      cta: "Ver critérios de avaliação",
    },
    whatsapp: {
      intro: "Uma pergunta simples para quem avalia equipamento:",
      highlight: "o que acontece quando a máquina para?",
      body:
        "Peças, manutenção e suporte técnico também fazem parte da produtividade. Esse custo quase sempre aparece depois da compra.",
      cta: "Quer receber um checklist de avaliação?",
    },
    linkedin: {
      headline: "Produtividade também se mede quando a máquina não está produzindo.",
      body:
        "Velocidade, capacidade e tecnologia chamam atenção na compra. Mas disponibilidade de peças, manutenção e suporte determinam quanto tempo o equipamento permanece realmente disponível para produzir. Pós-venda não é detalhe operacional: é parte do desempenho do investimento.",
      footer: "Disponibilidade operacional também é produtividade.",
    },
  },
  rastreabilidade: {
    email: {
      eyebrow: "RASTREABILIDADE",
      subject: "Rastreabilidade têxtil: por que o tema está deixando de ser apenas institucional",
      preheader: "Mais visibilidade sobre materiais, processos e cadeia pode melhorar decisões operacionais.",
      headline: "Rastreabilidade transforma informação em capacidade de decisão.",
      body:
        "Conhecer a origem, o fluxo e o destino dos materiais aumenta a visibilidade sobre a cadeia. Isso aproxima sustentabilidade da operação e cria melhores condições para responder a exigências de clientes, mercado e eficiência de recursos.",
      cta: "Entender os impactos",
    },
    whatsapp: {
      intro: "Um tema que está saindo do discurso e entrando na operação:",
      highlight: "rastreabilidade têxtil.",
      body:
        "Mais visibilidade sobre materiais e processos ajuda a responder a exigências de mercado e também melhora decisões internas.",
      cta: "Quer receber uma visão objetiva sobre o tema?",
    },
    linkedin: {
      headline: "Rastreabilidade está deixando de ser apenas uma pauta de sustentabilidade.",
      body:
        "Quando a empresa consegue enxergar melhor materiais, fornecedores e etapas do processo, ela ganha capacidade de responder a exigências externas e também de tomar decisões internas com mais informação. Circularidade, eficiência de recursos e rastreabilidade começam a convergir na operação.",
      footer: "Sustentabilidade ganha força quando vira processo.",
    },
  },
  mercado: {
    email: {
      eyebrow: "MERCADO TÊXTIL",
      subject: "O que acompanhar no mercado têxtil antes da próxima decisão de investimento",
      preheader: "Câmbio, matéria-prima, feiras e tecnologia podem mudar o contexto de uma decisão industrial.",
      headline: "Decisão de investimento começa antes da cotação.",
      body:
        "Movimentos de câmbio, matéria-prima, tecnologia, feiras e fornecedores ajudam a formar o contexto de uma decisão. Acompanhar esses sinais de forma organizada permite conversar com clientes antes que a demanda vire apenas um pedido de preço.",
      cta: "Ver sinais para acompanhar",
    },
    whatsapp: {
      intro: "Alguns sinais valem acompanhar antes de uma decisão de investimento:",
      highlight: "câmbio, matéria-prima, feiras e novos equipamentos.",
      body:
        "Organizar essas informações ajuda a antecipar conversas e avaliar melhor o momento de cada projeto.",
      cta: "Quer receber um resumo periódico?",
    },
    linkedin: {
      headline: "Relacionamento comercial melhora quando a conversa começa antes da cotação.",
      body:
        "Câmbio, matéria-prima, eventos, lançamentos e movimentos do setor criam contexto para decisões industriais. Acompanhar esses sinais permite que empresas fornecedoras mantenham uma conversa útil com o mercado sem depender apenas de campanhas promocionais.",
      footer: "Informação útil também é relacionamento.",
    },
  },
};

const radarVisualVariants = {
  automacao: [
    {
      id: "industrial-photo",
      label: "Fotografia industrial",
      title: "Fluxo automatizado em operação",
      subtitle: "Máquina, processo e produtividade no mesmo enquadramento",
      prompt: "Ambiente industrial têxtil contemporâneo, maquinário em operação, detalhes mecânicos, sensação de escala, fotografia editorial técnica, luz industrial controlada, sem pessoas em primeiro plano",
    },
    {
      id: "technical-grid",
      label: "Diagrama técnico",
      title: "Produtividade como sistema",
      subtitle: "Setup · estabilidade · manutenção · suporte",
      prompt: "Visual técnico abstrato inspirado em diagramas industriais, linhas de fluxo, módulos mecânicos, indicadores de processo e grid de engenharia, estética premium e sóbria",
    },
    {
      id: "market-editorial",
      label: "Editorial de mercado",
      title: "Automação além da velocidade",
      subtitle: "Decisão industrial orientada por operação",
      prompt: "Composição editorial industrial com máquina têxtil, dados de produtividade, tipografia técnica e leitura de mercado, estética de relatório executivo",
    },
  ],
  default: [
    {
      id: "industrial-photo",
      label: "Fotografia industrial",
      title: "Tecnologia têxtil em contexto",
      subtitle: "Operação, mercado e aplicação",
      prompt: "Ambiente industrial têxtil contemporâneo, maquinário e processo, fotografia editorial técnica, contraste elegante e composição profissional",
    },
    {
      id: "technical-grid",
      label: "Diagrama técnico",
      title: "Informação aplicada à operação",
      subtitle: "Dados, processo e decisão",
      prompt: "Diagrama industrial abstrato, grid técnico, indicadores de processo, fluxos e módulos, estética sofisticada de engenharia",
    },
    {
      id: "market-editorial",
      label: "Editorial de mercado",
      title: "Tema em movimento",
      subtitle: "Contexto para relacionamento comercial",
      prompt: "Composição editorial para setor têxtil com elementos de mercado, tecnologia e operação, visual premium e corporativo",
    },
  ],
};

function Status({ kind = "neutral", children }) {
  return <span className={"terminal-status " + kind}>{children}</span>;
}

function Metric({ label, value, helper }) {
  return (
    <div className="metric-strip-item">
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

function Overview({ setSection }) {
  return (
    <>
      <section className="metric-strip">
        <Metric label="Base ativa" value="1.248" helper="+36 nos últimos 30 dias" />
        <Metric label="Entregabilidade" value="96,8%" helper="canal de e-mail" />
        <Metric label="Interações" value="170" helper="cliques registrados" />
        <Metric label="Sinais comerciais" value="18" helper="para acompanhamento" />
      </section>

      <section className="terminal-grid overview-grid">
        <div className="terminal-panel panel-campaigns">
          <div className="terminal-section-head">
            <div>
              <span>Campanhas / operação</span>
              <small>últimos 30 dias</small>
            </div>
            <button className="terminal-link" onClick={() => setSection("email")}>
              abrir e-mail →
            </button>
          </div>

          <div className="terminal-table-wrap">
            <table className="terminal-table campaign-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Campanha</th>
                  <th>Público</th>
                  <th className="align-right">Base</th>
                  <th className="align-right">Entrega</th>
                  <th className="align-right">CTR</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>
                      <Status kind={campaign.status === "live" ? "live" : "sent"}>
                        {campaign.status === "live" ? "● " : "✓ "}
                        {campaign.statusLabel}
                      </Status>
                    </td>
                    <td>
                      <strong>{campaign.title}</strong>
                    </td>
                    <td className="muted-cell">{campaign.segment}</td>
                    <td className="align-right">{campaign.audience}</td>
                    <td className="align-right">
                      {((campaign.delivered / campaign.audience) * 100).toFixed(1)}%
                    </td>
                    <td className="align-right">{campaign.ctr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="terminal-section-head secondary">
            <div>
              <span>Atividade em tempo real</span>
              <small>stream comercial demonstrativo</small>
            </div>
          </div>

          <div className="activity-stream">
            {activity.map(([time, title, description, channel]) => (
              <div className="activity-row" key={time + title}>
                <time>{time}</time>
                <div>
                  <strong>{title}</strong>
                  <span>{description}</span>
                </div>
                <Status>{channel}</Status>
              </div>
            ))}
          </div>
        </div>

        <aside className="terminal-panel panel-signals">
          <div className="terminal-section-head">
            <div>
              <span>Sinais de interesse</span>
              <small>distribuição demonstrativa</small>
            </div>
          </div>

          <div className="signal-list">
            {signals.map(([label, value]) => (
              <div className="signal-row" key={label}>
                <div className="signal-row-top">
                  <span>{label}</span>
                  <b>{value}%</b>
                </div>
                <div className="signal-track">
                  <div className="signal-fill" style={{ width: value + "%" }} />
                </div>
              </div>
            ))}
          </div>

          <div className="terminal-section-head secondary">
            <div>
              <span>Atendimento</span>
              <small>agora</small>
            </div>
          </div>

          <div className="ops-list">
            <button onClick={() => setSection("whatsapp")}>
              <strong>02</strong>
              <span>Prioridade alta</span>
              <small>oportunidades comerciais</small>
            </button>
            <button onClick={() => setSection("whatsapp")}>
              <strong>07</strong>
              <span>Conversas abertas</span>
              <small>fila de relacionamento</small>
            </button>
            <button onClick={() => setSection("whatsapp")}>
              <strong>01</strong>
              <span>Atendimento técnico</span>
              <small>aguardando retorno</small>
            </button>
          </div>
        </aside>
      </section>

      <section className="industrial-feature">
        <div className="industrial-visual" aria-hidden="true">
          <div className="machine-grid" />
          <div className="machine-axis axis-one" />
          <div className="machine-axis axis-two" />
          <div className="machine-axis axis-three" />
        </div>
        <div className="industrial-copy">
          <span className="terminal-kicker">Conteúdo em destaque</span>
          <h2>Máquinas, peças e oportunidades podem virar relacionamento mensurável.</h2>
          <p>
            A mesma operação que informa o mercado registra interesse, organiza contatos
            e entrega contexto para o time comercial.
          </p>
          <button className="terminal-action" onClick={() => setSection("email")}>
            Ver campanha em operação
          </button>
        </div>
      </section>
    </>
  );
}

function EmailSection() {
  const [selected, setSelected] = useState(campaigns[1]);
  const [recipient, setRecipient] = useState("");
  const [engine, setEngine] = useState(null);
  const [delivery, setDelivery] = useState({
    status: "idle",
    message: "",
    delivered: false,
  });

  useEffect(() => {
    let active = true;

    fetch("/api/email/test-send", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (active) setEngine(data);
      })
      .catch(() => {
        if (active) setEngine(null);
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleDemoSend(event) {
    event.preventDefault();

    setDelivery({
      status: "loading",
      message: "Validando envio...",
      delivered: false,
    });

    try {
      const response = await fetch("/api/email/test-send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ recipient }),
      });

      const data = await response.json();

      setDelivery({
        status: response.ok ? "success" : "error",
        message:
          data?.message ||
          (response.ok
            ? "Demonstração processada."
            : "Não foi possível processar o envio."),
        delivered: Boolean(data?.delivered),
        mode: data?.mode || engine?.mode || "preview",
        messageId: data?.messageId || null,
      });
    } catch {
      setDelivery({
        status: "error",
        message: "Não foi possível conectar ao serviço de envio.",
        delivered: false,
      });
    }
  }

  return (
    <section className="terminal-grid email-command-grid">
      <aside className="terminal-panel email-campaign-list">
        <div className="terminal-section-head">
          <div>
            <span>Campanhas</span>
            <small>operação de e-mail</small>
          </div>
        </div>

        <div className="engine-line">
          <span className={"engine-light " + (engine?.mode === "live" ? "live" : "")} />
          <div>
            <strong>{engine?.mode === "live" ? "ENVIO HABILITADO" : "MODO PREVIEW"}</strong>
            <small>
              {engine?.mode === "live"
                ? "disparos reais limitados à allowlist"
                : "nenhuma mensagem real é enviada"}
            </small>
          </div>
        </div>

        <div className="campaign-terminal-list">
          {campaigns.map((campaign) => (
            <button
              className={selected.id === campaign.id ? "active" : ""}
              key={campaign.id}
              onClick={() => setSelected(campaign)}
            >
              <div className="campaign-terminal-top">
                <Status kind={campaign.status === "live" ? "live" : "sent"}>
                  {campaign.statusLabel}
                </Status>
                <span>{campaign.ctr} CTR</span>
              </div>
              <strong>{campaign.title}</strong>
              <small>{campaign.segment}</small>
            </button>
          ))}
        </div>
      </aside>

      <div className="terminal-panel email-preview-panel">
        <div className="terminal-section-head">
          <div>
            <span>Conteúdo da campanha</span>
            <small>{selected.title}</small>
          </div>
          <Status kind="sent">PREVIEW</Status>
        </div>

        <div className="email-performance-strip">
          <div><span>Base</span><strong>{selected.audience}</strong></div>
          <div><span>Entregues</span><strong>{selected.delivered}</strong></div>
          <div><span>Cliques</span><strong>{selected.clicks}</strong></div>
          <div><span>CTR</span><strong>{selected.ctr}</strong></div>
        </div>

        <div className="email-editorial-preview">
          <div className="email-preview-rail">
            <span>TEXFIELD</span>
            <small>INFORMAÇÃO · TECNOLOGIA · INDÚSTRIA</small>
          </div>
          <div className="email-preview-body">
            <span className="terminal-kicker">Relacionamento comercial</span>
            <h2>{selected.title}</h2>
            <p>
              Máquinas, componentes, assistência e tecnologia para apoiar a operação
              industrial e manter o relacionamento comercial ativo.
            </p>
            <button type="button">Conhecer solução</button>
          </div>
        </div>
      </div>

      <aside className="terminal-panel email-distribution-panel">
        <div className="terminal-section-head">
          <div>
            <span>Distribuição</span>
            <small>teste controlado</small>
          </div>
        </div>

        <form className="terminal-form" onSubmit={handleDemoSend}>
          <label htmlFor="demo-recipient">Destinatário de teste</label>
          <input
            id="demo-recipient"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="nome@empresa.com.br"
            value={recipient}
            onChange={(event) => setRecipient(event.target.value)}
            required
          />
          <button
            className="terminal-action"
            type="submit"
            disabled={delivery.status === "loading"}
          >
            {delivery.status === "loading" ? "PROCESSANDO..." : "ENVIAR DEMONSTRAÇÃO"}
          </button>
        </form>

        <div className="distribution-note">
          <strong>CONTROLE DE SEGURANÇA</strong>
          <p>
            Em modo live, somente endereços previamente autorizados podem receber a
            demonstração.
          </p>
        </div>

        {delivery.status !== "idle" && (
          <div
            className={
              "terminal-message " +
              (delivery.status === "error"
                ? "error"
                : delivery.delivered
                  ? "success"
                  : "preview")
            }
            role="status"
          >
            <strong>
              {delivery.status === "error"
                ? "ENVIO NÃO CONCLUÍDO"
                : delivery.delivered
                  ? "MENSAGEM ENVIADA"
                  : "PREVIEW VALIDADO"}
            </strong>
            <span>{delivery.message}</span>
            {delivery.messageId && <small>{delivery.messageId}</small>}
          </div>
        )}
      </aside>
    </section>
  );
}

function ContactsSection() {
  return (
    <section className="terminal-panel full-terminal">
      <div className="terminal-section-head">
        <div>
          <span>Base de relacionamento</span>
          <small>contatos, perfil e interesse</small>
        </div>
        <Status>1.248 REGISTROS</Status>
      </div>

      <div className="filter-line">
        <button className="active">TODOS · 1.248</button>
        <button>CLIENTES · 786</button>
        <button>PROSPECTS · 312</button>
        <button>PARCEIROS · 150</button>
      </div>

      <div className="terminal-table-wrap">
        <table className="terminal-table contacts-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Tipo</th>
              <th>Interesse</th>
              <th>Região</th>
              <th>Status</th>
              <th>Última atividade</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((contact) => (
              <tr key={contact[0]}>
                <td><strong>{contact[0]}</strong></td>
                <td>{contact[1]}</td>
                <td>{contact[2]}</td>
                <td className="muted-cell">{contact[3]}</td>
                <td><Status kind={contact[4] === "Oportunidade" ? "live" : "sent"}>{contact[4]}</Status></td>
                <td className="muted-cell">{contact[5]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="contact-summary-strip">
        <div><span>Máquinas</span><strong>42%</strong></div>
        <div><span>Peças</span><strong>31%</strong></div>
        <div><span>Assistência</span><strong>17%</strong></div>
        <div><span>Outros</span><strong>10%</strong></div>
      </div>
    </section>
  );
}

function WhatsAppSection() {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <section className="whatsapp-command-grid">
      <aside className="terminal-panel queue-panel">
        <div className="terminal-section-head">
          <div>
            <span>Fila de atendimento</span>
            <small>WhatsApp</small>
          </div>
          <Status kind="live">07 OPEN</Status>
        </div>

        <div className="conversation-terminal-list">
          {conversations.map((conversation) => (
            <button
              key={conversation.company}
              onClick={() => setSelected(conversation)}
              className={selected.company === conversation.company ? "active" : ""}
            >
              <div>
                <strong>{conversation.company}</strong>
                <time>{conversation.time}</time>
              </div>
              <span>{conversation.message}</span>
              <div className="conversation-tags">
                <Status>{conversation.category}</Status>
                <Status kind={conversation.priority === "Alta" ? "live" : "neutral"}>
                  {conversation.priority}
                </Status>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <div className="terminal-panel conversation-stage">
        <div className="conversation-header">
          <div>
            <span className="terminal-kicker">CONVERSA ATIVA</span>
            <h2>{selected.company}</h2>
          </div>
          <Status kind={selected.priority === "Alta" ? "live" : "sent"}>
            PRIORIDADE {selected.priority.toUpperCase()}
          </Status>
        </div>

        <div className="conversation-log">
          <div className="log-entry incoming">
            <time>{selected.time}</time>
            <p>{selected.message}</p>
          </div>

          <div className="context-event">
            <span>SISTEMA</span>
            <strong>Contexto identificado · {selected.category}</strong>
            <small>Responsável sugerido: {selected.owner}</small>
          </div>

          <div className="log-entry outgoing">
            <time>10:43</time>
            <p>
              Olá! Recebemos sua mensagem. Vou direcionar sua solicitação ao responsável
              e seguimos por aqui.
            </p>
          </div>
        </div>

        <div className="command-compose">
          <input readOnly value="Digite uma resposta..." aria-label="Resposta de demonstração" />
          <button type="button">ENVIAR</button>
        </div>
      </div>

      <aside className="terminal-panel intelligence-panel">
        <div className="terminal-section-head">
          <div>
            <span>Inteligência do contato</span>
            <small>contexto comercial</small>
          </div>
        </div>

        <dl className="context-list">
          <div><dt>Perfil</dt><dd>Cliente / prospect</dd></div>
          <div><dt>Interesse</dt><dd>{selected.category}</dd></div>
          <div><dt>Responsável</dt><dd>{selected.owner}</dd></div>
          <div><dt>Último e-mail</dt><dd>Novidades Texfield</dd></div>
          <div><dt>Interação</dt><dd>Clique registrado</dd></div>
        </dl>

        <div className="contact-score">
          <span>PROPENSÃO COMERCIAL</span>
          <strong>82</strong>
          <small>score ilustrativo</small>
          <div><i style={{ width: "82%" }} /></div>
        </div>
      </aside>
    </section>
  );
}

function ReportsSection() {
  const [selectedTopicId, setSelectedTopicId] = useState(radarTopics[0].id);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [draftVisible, setDraftVisible] = useState(false);
  const [distributionState, setDistributionState] = useState("");
  const [selectedChannel, setSelectedChannel] = useState("email");
  const [visualIndex, setVisualIndex] = useState(0);
  const [imageEngine, setImageEngine] = useState(null);
  const [imageGeneration, setImageGeneration] = useState({
    status: "idle",
    imageUrl: null,
    assetId: null,
    prompt: null,
    message: "",
    mode: "preview",
  });

  const selectedTopic =
    radarTopics.find((topic) => topic.id === selectedTopicId) || radarTopics[0];

  const channelCopy =
    radarChannelCopy[selectedTopic.id] || radarChannelCopy.automacao;

  const visualSet =
    radarVisualVariants[selectedTopic.id] || radarVisualVariants.default;

  const activeVisual = visualSet[visualIndex % visualSet.length];

  const generatedImageStyle = imageGeneration.imageUrl
    ? {
        backgroundImage:
          `linear-gradient(rgba(7, 10, 12, .12), rgba(7, 10, 12, .34)), url("${imageGeneration.imageUrl}")`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : undefined;

  useEffect(() => {
    let active = true;

    fetch("/api/editorial/generate-image", { cache: "no-store" })
      .then((response) => response.json())
      .then((data) => {
        if (active) setImageEngine(data);
      })
      .catch(() => {
        if (active) setImageEngine(null);
      });

    return () => {
      active = false;
    };
  }, []);

  function resetImageGeneration() {
    setImageGeneration({
      status: "idle",
      imageUrl: null,
      assetId: null,
      prompt: null,
      message: "",
      mode: imageEngine?.mode || "preview",
    });
  }

  function selectTopic(topicId) {
    setSelectedTopicId(topicId);
    setWorkspaceOpen(false);
    setDraftVisible(false);
    setDistributionState("");
    setSelectedChannel("email");
    setVisualIndex(0);
    resetImageGeneration();
  }

  function openWorkspace() {
    setWorkspaceOpen(true);
    setDraftVisible(false);
    setDistributionState("");
    setSelectedChannel("email");
    setVisualIndex(0);
    resetImageGeneration();
  }

  function deriveChannel(channel) {
    setSelectedChannel(channel);
    setDistributionState(
      channel === "email"
        ? "Versão para e-mail preparada no fluxo demonstrativo."
        : channel === "whatsapp"
          ? "Versão para WhatsApp preparada no fluxo demonstrativo."
          : "Versão para LinkedIn preparada no fluxo demonstrativo.",
    );
  }

  function chooseVisual(index) {
    setVisualIndex(index);
    resetImageGeneration();
  }

  async function generateVisualImage() {
    setImageGeneration((current) => ({
      ...current,
      status: "loading",
      message:
        imageEngine?.mode === "live"
          ? "Gerando imagem com base no contexto editorial..."
          : "Validando prompt visual...",
    }));

    try {
      const response = await fetch("/api/editorial/generate-image", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          topicSlug: selectedTopic.id,
          topicTitle: selectedTopic.title,
          topicSummary: selectedTopic.summary,
          topicAngle: selectedTopic.angle,
          articleTitle: selectedTopic.articleTitle,
          articleObjective: selectedTopic.objective,
          visualDirection: activeVisual.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Não foi possível gerar o ativo visual.",
        );
      }

      setImageGeneration({
        status: "success",
        imageUrl: data?.imageUrl || null,
        assetId: data?.assetId || null,
        prompt: data?.prompt || activeVisual.prompt,
        message: data?.message || "Ativo visual processado.",
        mode: data?.mode || imageEngine?.mode || "preview",
      });
    } catch (error) {
      setImageGeneration((current) => ({
        ...current,
        status: "error",
        message:
          error instanceof Error
            ? error.message
            : "Não foi possível gerar o ativo visual.",
      }));
    }
  }

  return (
    <section className="radar-shell">
      <div className="radar-head">
        <div>
          <span className="terminal-kicker">INTELIGÊNCIA / RADAR SETORIAL</span>
          <h2>Do mercado para uma pauta útil de relacionamento.</h2>
          <p>
            Fontes selecionadas, sinais do setor e oportunidades editoriais organizadas
            para ajudar a Texfield a manter contato recorrente sem depender de pautas
            improvisadas.
          </p>
        </div>

        <div className="radar-head-status">
          <Status kind="live">RADAR DEMONSTRATIVO</Status>
          <span>6 FONTES · 6 TEMAS · CURADORIA HUMANA + IA</span>
        </div>
      </div>

      <div className="source-monitor">
        <div className="terminal-section-head">
          <div>
            <span>Fontes de interesse do público</span>
            <small>configuração demonstrativa do monitoramento</small>
          </div>
          <Status>FONTES SELECIONADAS</Status>
        </div>

        <div className="source-grid">
          {radarSources.map(([name, focus, status]) => (
            <div className="source-row" key={name}>
              <div className="source-index">
                {String(radarSources.findIndex((source) => source[0] === name) + 1).padStart(2, "0")}
              </div>
              <div>
                <strong>{name}</strong>
                <span>{focus}</span>
              </div>
              <Status kind={status === "MONITORADA" ? "live" : "neutral"}>{status}</Status>
            </div>
          ))}
        </div>
      </div>

      <div className="radar-workbench">
        <div className="terminal-panel topic-list-panel">
          <div className="terminal-section-head">
            <div>
              <span>Temas em destaque</span>
              <small>oportunidades editoriais para relacionamento</small>
            </div>
          </div>

          <div className="topic-list">
            {radarTopics.map((topic, index) => (
              <button
                key={topic.id}
                className={topic.id === selectedTopic.id ? "active" : ""}
                onClick={() => selectTopic(topic.id)}
              >
                <span className="topic-number">{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <div className="topic-status-line">
                    <Status kind={topic.relevance === "ALTA" ? "live" : "neutral"}>
                      {topic.relevance}
                    </Status>
                    <span>{topic.trend}</span>
                  </div>
                  <strong>{topic.title}</strong>
                  <small>{topic.summary}</small>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="terminal-panel topic-detail-panel">
          <div className="terminal-section-head">
            <div>
              <span>Leitura do tema</span>
              <small>{selectedTopic.title}</small>
            </div>
            <Status kind={selectedTopic.relevance === "ALTA" ? "live" : "neutral"}>
              RELEVÂNCIA {selectedTopic.relevance}
            </Status>
          </div>

          <div className="topic-detail">
            <div className="topic-detail-title">
              <span className="terminal-kicker">{selectedTopic.trend}</span>
              <h3>{selectedTopic.title}</h3>
              <p>{selectedTopic.summary}</p>
            </div>

            <div className="topic-context-grid">
              <div>
                <span>PÚBLICO RELACIONADO</span>
                <strong>{selectedTopic.audience}</strong>
              </div>
              <div>
                <span>RELAÇÃO COM A TEXFIELD</span>
                <strong>{selectedTopic.relation}</strong>
              </div>
            </div>

            <div className="topic-analysis">
              <span>POR QUE ISSO PODE INTERESSAR AO PÚBLICO</span>
              <p>{selectedTopic.angle}</p>
            </div>

            <div className="source-tags">
              <span>FONTES ASSOCIADAS</span>
              <div>
                {selectedTopic.sources.map((source) => (
                  <Status key={source}>{source}</Status>
                ))}
              </div>
            </div>

            <button className="terminal-action radar-primary-action" onClick={openWorkspace}>
              ESTRUTURAR ARTIGO RELEVANTE
            </button>
          </div>
        </div>
      </div>

      {workspaceOpen && (
        <div className="content-workspace">
          <div className="workspace-header">
            <div>
              <span className="terminal-kicker">ASSISTENTE EDITORIAL</span>
              <h2>Estrutura sugerida</h2>
            </div>
            <button
              type="button"
              className="workspace-close"
              onClick={() => setWorkspaceOpen(false)}
              aria-label="Fechar estrutura do artigo"
            >
              FECHAR ×
            </button>
          </div>

          <div className="workspace-grid">
            <div className="workspace-brief">
              <div className="brief-field">
                <span>TEMA</span>
                <strong>{selectedTopic.articleTitle}</strong>
              </div>
              <div className="brief-field">
                <span>PÚBLICO</span>
                <strong>{selectedTopic.audience}</strong>
              </div>
              <div className="brief-field">
                <span>OBJETIVO</span>
                <strong>{selectedTopic.objective}</strong>
              </div>
              <div className="brief-field">
                <span>ABORDAGEM</span>
                <p>{selectedTopic.angle}</p>
              </div>

              <div className="workspace-sources">
                <span>FONTES PARA VALIDAÇÃO</span>
                <div>
                  {selectedTopic.sources.map((source) => (
                    <Status key={source}>{source}</Status>
                  ))}
                </div>
              </div>
            </div>

            <div className="workspace-outline">
              <span className="terminal-kicker">ESTRUTURA</span>
              <ol>
                {selectedTopic.outline.map((item, index) => (
                  <li key={item}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{item}</strong>
                  </li>
                ))}
              </ol>

              <button
                className="terminal-action"
                type="button"
                onClick={() => setDraftVisible(true)}
              >
                GERAR RASCUNHO DEMONSTRATIVO
              </button>
            </div>
          </div>

          {draftVisible && (
            <div className="editorial-production">
              <div className="draft-copy">
                <div className="terminal-section-head">
                  <div>
                    <span>Rascunho editorial</span>
                    <small>texto base para revisão humana</small>
                  </div>
                  <Status>DRAFT</Status>
                </div>

                <article>
                  <span className="terminal-kicker">TÍTULO SUGERIDO</span>
                  <h3>{selectedTopic.articleTitle}</h3>
                  <p>{channelCopy.email.body}</p>
                  <p>
                    A proposta do assistente é organizar o raciocínio e acelerar a primeira
                    versão. Dados técnicos, exemplos, posicionamento e referências continuam
                    sob revisão da Texfield antes de qualquer publicação.
                  </p>
                </article>
              </div>

              <section className="visual-studio">
                <div className="terminal-section-head">
                  <div>
                    <span>Ativo visual</span>
                    <small>geração contextual demonstrativa</small>
                  </div>
                  <Status kind={imageEngine?.mode === "live" && imageEngine?.liveConfigured ? "live" : "neutral"}>
                    {imageEngine?.mode === "live" && imageEngine?.liveConfigured
                      ? "VISUAL AI · LIVE"
                      : "VISUAL AI · PREVIEW"}
                  </Status>
                </div>

                <div className="visual-studio-grid">
                  <div
                    className={
                      "generated-visual " +
                      activeVisual.id +
                      (imageGeneration.imageUrl ? " has-real-image" : "")
                    }
                    style={generatedImageStyle}
                  >
                    <div className="generated-grid" />
                    <div className="generated-machine machine-a" />
                    <div className="generated-machine machine-b" />
                    <div className="generated-data-line line-a" />
                    <div className="generated-data-line line-b" />
                    <div className="generated-visual-copy">
                      <span>{activeVisual.label}</span>
                      <strong>{activeVisual.title}</strong>
                      <small>{activeVisual.subtitle}</small>
                    </div>
                  </div>

                  <div className="visual-control-panel">
                    <span className="terminal-kicker">DIREÇÃO VISUAL</span>

                    <div className="visual-variant-tabs">
                      {visualSet.map((visual, index) => (
                        <button
                          type="button"
                          key={visual.id}
                          className={index === visualIndex ? "active" : ""}
                          onClick={() => chooseVisual(index)}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          <strong>{visual.label}</strong>
                        </button>
                      ))}
                    </div>

                    <div className="visual-prompt">
                      <span>PROMPT SUGERIDO</span>
                      <p>{imageGeneration.prompt || activeVisual.prompt}</p>
                    </div>

                    <div className="visual-action-row">
                      <button
                        type="button"
                        className="terminal-action"
                        onClick={generateVisualImage}
                        disabled={imageGeneration.status === "loading"}
                      >
                        {imageGeneration.status === "loading"
                          ? "GERANDO..."
                          : "GERAR IMAGEM"}
                      </button>
                      <button
                        type="button"
                        className="secondary-terminal-button"
                        onClick={generateVisualImage}
                        disabled={imageGeneration.status === "loading"}
                      >
                        REGERAR
                      </button>
                    </div>

                    <small className="visual-demo-note">
                      {imageEngine?.mode === "live" && imageEngine?.liveConfigured
                        ? "Geração real habilitada. O ativo é armazenado e reutilizado nos previews dos canais."
                        : "Em preview, validamos prompt e fluxo sem consumir geração de imagem. Ao ativar live, OpenAI + Blob + Neon passam a operar este botão."}
                    </small>

                    {imageGeneration.status !== "idle" && (
                      <div
                        className={
                          "visual-generation-message " +
                          (imageGeneration.status === "error"
                            ? "error"
                            : imageGeneration.imageUrl
                              ? "success"
                              : "preview")
                        }
                        role="status"
                      >
                        <strong>
                          {imageGeneration.status === "loading"
                            ? "PROCESSANDO"
                            : imageGeneration.status === "error"
                              ? "GERAÇÃO NÃO CONCLUÍDA"
                              : imageGeneration.imageUrl
                                ? "ATIVO GERADO"
                                : "PROMPT VALIDADO"}
                        </strong>
                        <span>{imageGeneration.message}</span>
                        {imageGeneration.assetId && (
                          <small>Asset: {imageGeneration.assetId}</small>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </section>

              <section className="channel-preview-studio">
                <div className="terminal-section-head">
                  <div>
                    <span>Preview multicanal</span>
                    <small>a mesma pauta adaptada ao meio de envio</small>
                  </div>
                  <Status kind="live">3 CANAIS</Status>
                </div>

                <div className="channel-tabs">
                  {[
                    ["email", "E-mail"],
                    ["whatsapp", "WhatsApp"],
                    ["linkedin", "LinkedIn"],
                  ].map(([key, label]) => (
                    <button
                      type="button"
                      key={key}
                      className={selectedChannel === key ? "active" : ""}
                      onClick={() => {
                        setSelectedChannel(key);
                        setDistributionState("");
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <div className="channel-preview-body">
                  {selectedChannel === "email" && (
                    <div className="email-device-preview">
                      <div className="email-preview-meta">
                        <div>
                          <span>ASSUNTO</span>
                          <strong>{channelCopy.email.subject}</strong>
                        </div>
                        <div>
                          <span>PREHEADER</span>
                          <p>{channelCopy.email.preheader}</p>
                        </div>
                      </div>

                      <div className="email-preview-message">
                        <div className="email-preview-brand">
                          <strong>TEXFIELD</strong>
                          <span>INFORMAÇÃO · TECNOLOGIA · INDÚSTRIA</span>
                        </div>
                        <div
                          className={
                            "channel-visual " +
                            activeVisual.id +
                            (imageGeneration.imageUrl ? " has-real-image" : "")
                          }
                          style={generatedImageStyle}
                        >
                          <div className="channel-visual-grid" />
                          <span>{activeVisual.label}</span>
                        </div>
                        <div className="email-preview-content">
                          <span>{channelCopy.email.eyebrow}</span>
                          <h3>{channelCopy.email.headline}</h3>
                          <p>{channelCopy.email.body}</p>
                          <button type="button">{channelCopy.email.cta}</button>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedChannel === "whatsapp" && (
                    <div className="whatsapp-device-preview">
                      <div className="phone-topbar">
                        <div className="phone-avatar">TX</div>
                        <div>
                          <strong>Texfield</strong>
                          <span>canal de relacionamento</span>
                        </div>
                      </div>
                      <div className="phone-chat">
                        <div
                          className={
                            "wa-image-preview " +
                            activeVisual.id +
                            (imageGeneration.imageUrl ? " has-real-image" : "")
                          }
                          style={generatedImageStyle}
                        >
                          <div className="channel-visual-grid" />
                          <span>{activeVisual.title}</span>
                        </div>
                        <div className="wa-message-bubble">
                          <p>{channelCopy.whatsapp.intro}</p>
                          <strong>{channelCopy.whatsapp.highlight}</strong>
                          <p>{channelCopy.whatsapp.body}</p>
                          <a>{channelCopy.whatsapp.cta}</a>
                          <small>11:32 ✓✓</small>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedChannel === "linkedin" && (
                    <div className="linkedin-device-preview">
                      <div className="linkedin-author">
                        <div className="linkedin-avatar">TX</div>
                        <div>
                          <strong>Texfield</strong>
                          <span>Máquinas, peças e soluções para a indústria têxtil</span>
                          <small>Agora · 🌐</small>
                        </div>
                      </div>

                      <div className="linkedin-post-copy">
                        <strong>{channelCopy.linkedin.headline}</strong>
                        <p>{channelCopy.linkedin.body}</p>
                        <p className="linkedin-footer-copy">{channelCopy.linkedin.footer}</p>
                        <span>#IndústriaTêxtil #Tecnologia #Produtividade</span>
                      </div>

                      <div
                        className={
                          "linkedin-post-visual " +
                          activeVisual.id +
                          (imageGeneration.imageUrl ? " has-real-image" : "")
                        }
                        style={generatedImageStyle}
                      >
                        <div className="channel-visual-grid" />
                        <div>
                          <span>{activeVisual.label}</span>
                          <strong>{activeVisual.title}</strong>
                        </div>
                      </div>

                      <div className="linkedin-actions">
                        <span>Recomendar</span>
                        <span>Comentar</span>
                        <span>Compartilhar</span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="channel-finalize-bar">
                  <div>
                    <span>CANAL SELECIONADO</span>
                    <strong>
                      {selectedChannel === "email"
                        ? "E-mail"
                        : selectedChannel === "whatsapp"
                          ? "WhatsApp"
                          : "LinkedIn"}
                    </strong>
                  </div>
                  <button
                    type="button"
                    className="terminal-action"
                    onClick={() => deriveChannel(selectedChannel)}
                  >
                    PREPARAR VERSÃO FINAL
                  </button>
                </div>

                {distributionState && (
                  <div className="terminal-message preview" role="status">
                    <strong>DERIVAÇÃO PREPARADA</strong>
                    <span>{distributionState}</span>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      )}

      <div className="radar-disclaimer">
        <span>DEMO</span>
        <p>
          O radar desta versão usa temas e fontes ilustrativos. Em produção, coleta,
          relevância, periodicidade, fontes, geração visual e aprovação seriam configuráveis
          por tenant, com revisão humana antes da publicação.
        </p>
      </div>
    </section>
  );
}

export default function DemoShell({ tenant }) {
  const [section, setSection] = useState("overview");
  const [clock, setClock] = useState("");

  useEffect(() => {
    const update = () => {
      setClock(
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date()),
      );
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const activeLabel = useMemo(
    () => navItems.find(([key]) => key === section)?.[1] || "Visão geral",
    [section],
  );

  return (
    <main className="command-shell">
      <div className="market-ticker" aria-label="Faixa informacional demonstrativa">
        <div className="ticker-track">
          <span>ALGODÃO <b>MONITORAMENTO</b></span>
          <span>USD / BRL <b>CÂMBIO</b></span>
          <span>EUR / BRL <b>CÂMBIO</b></span>
          <span>INDÚSTRIA TÊXTIL <b>OPORTUNIDADES</b></span>
          <span>FEIRAS & EVENTOS <b>AGENDA 2026</b></span>
          <span>PEÇAS & SERVIÇOS <b>RELACIONAMENTO</b></span>
          <span>ALGODÃO <b>MONITORAMENTO</b></span>
          <span>USD / BRL <b>CÂMBIO</b></span>
          <span>EUR / BRL <b>CÂMBIO</b></span>
          <span>INDÚSTRIA TÊXTIL <b>OPORTUNIDADES</b></span>
        </div>
      </div>

      <header className="command-header">
        <div className="command-brand">
          <div className="command-logo">TX</div>
          <div>
            <strong>{tenant.brand}</strong>
            <span>RELATIONSHIP INTELLIGENCE / COMMAND CENTER</span>
          </div>
        </div>

        <div className="command-status">
          <span><i /> SISTEMA ONLINE</span>
          <b>{clock || "--:--:--"}</b>
          <small>AMBIENTE DEMONSTRATIVO · DADOS ILUSTRATIVOS</small>
        </div>
      </header>

      <nav className="command-nav" aria-label="Navegação principal">
        <div className="command-nav-inner">
          {navItems.map(([key, label]) => (
            <button
              key={key}
              className={section === key ? "active" : ""}
              onClick={() => setSection(key)}
            >
              {label}
            </button>
          ))}
        </div>
        <span className="current-view">{activeLabel.toUpperCase()}</span>
      </nav>

      <div className="command-content">
        {section === "overview" && <Overview setSection={setSection} />}
        {section === "email" && <EmailSection />}
        {section === "contacts" && <ContactsSection />}
        {section === "whatsapp" && <WhatsAppSection />}
        {section === "reports" && <ReportsSection />}
      </div>

      <footer className="command-footer">
        <span>PROXY TECHNOLOGY · RELATIONSHIP PLATFORM</span>
        <span>TENANT / TEXFIELD</span>
      </footer>
    </main>
  );
}
