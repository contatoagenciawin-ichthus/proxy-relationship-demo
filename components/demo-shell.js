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

  const selectedTopic =
    radarTopics.find((topic) => topic.id === selectedTopicId) || radarTopics[0];

  function selectTopic(topicId) {
    setSelectedTopicId(topicId);
    setWorkspaceOpen(false);
    setDraftVisible(false);
    setDistributionState("");
  }

  function openWorkspace() {
    setWorkspaceOpen(true);
    setDraftVisible(false);
    setDistributionState("");
  }

  function deriveChannel(channel) {
    setDistributionState(
      channel === "email"
        ? "Versão para e-mail preparada no fluxo demonstrativo."
        : channel === "whatsapp"
          ? "Versão para WhatsApp preparada no fluxo demonstrativo."
          : "Versão para LinkedIn preparada no fluxo demonstrativo.",
    );
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
              <div className="source-index">{String(radarSources.findIndex((source) => source[0] === name) + 1).padStart(2, "0")}</div>
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
            <div className="draft-stage">
              <div className="draft-copy">
                <div className="terminal-section-head">
                  <div>
                    <span>Rascunho editorial</span>
                    <small>exemplo de saída assistida</small>
                  </div>
                  <Status>DRAFT</Status>
                </div>

                <article>
                  <span className="terminal-kicker">TÍTULO SUGERIDO</span>
                  <h3>{selectedTopic.articleTitle}</h3>
                  <p>
                    Na indústria têxtil, produtividade não depende apenas da velocidade
                    nominal de um equipamento. A estabilidade da operação, o tempo de
                    setup, a manutenção, a disponibilidade de peças e a capacidade de
                    suporte também influenciam o resultado que chega ao final da linha.
                  </p>
                  <p>
                    Este rascunho demonstra como o sistema pode transformar um tema
                    identificado no radar em uma pauta estruturada. Antes de qualquer
                    publicação, a Texfield revisaria dados, posicionamento técnico e
                    referências.
                  </p>
                </article>
              </div>

              <aside className="distribution-workflow">
                <div className="terminal-section-head">
                  <div>
                    <span>Derivar conteúdo</span>
                    <small>um tema, múltiplos canais</small>
                  </div>
                </div>

                <div className="channel-actions">
                  <button type="button" onClick={() => deriveChannel("email")}>
                    <span>E-MAIL</span>
                    <strong>Criar versão de relacionamento</strong>
                    <small>assunto, preheader, corpo e CTA</small>
                  </button>
                  <button type="button" onClick={() => deriveChannel("whatsapp")}>
                    <span>WHATSAPP</span>
                    <strong>Criar versão curta</strong>
                    <small>mensagem objetiva com contexto</small>
                  </button>
                  <button type="button" onClick={() => deriveChannel("linkedin")}>
                    <span>LINKEDIN</span>
                    <strong>Criar versão institucional</strong>
                    <small>abertura, desenvolvimento e fechamento</small>
                  </button>
                </div>

                {distributionState && (
                  <div className="terminal-message preview" role="status">
                    <strong>DERIVAÇÃO PREPARADA</strong>
                    <span>{distributionState}</span>
                  </div>
                )}
              </aside>
            </div>
          )}
        </div>
      )}

      <div className="radar-disclaimer">
        <span>DEMO</span>
        <p>
          O radar desta versão usa temas e fontes ilustrativos. Em produção, coleta,
          relevância, periodicidade e fontes seriam configuráveis por tenant, com revisão
          humana antes da publicação.
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
