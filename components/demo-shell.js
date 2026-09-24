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
  const trend = [34, 48, 45, 62, 59, 74, 68, 82, 76, 91, 86, 96];

  return (
    <section className="intelligence-layout">
      <div className="terminal-panel intelligence-main">
        <div className="terminal-section-head">
          <div>
            <span>Inteligência de relacionamento</span>
            <small>leitura operacional da base</small>
          </div>
          <Status>30 DIAS</Status>
        </div>

        <div className="intelligence-kpis">
          <div><span>Base ativa</span><strong>1.248</strong><small>+2,9%</small></div>
          <div><span>Entregabilidade</span><strong>96,8%</strong><small>+1,2 p.p.</small></div>
          <div><span>CTR médio</span><strong>12,4%</strong><small>+2,1 p.p.</small></div>
          <div><span>Descadastros</span><strong>0,7%</strong><small>-0,2 p.p.</small></div>
        </div>

        <div className="trend-chart">
          <div className="trend-scale">
            <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
          </div>
          <div className="trend-bars">
            {trend.map((value, index) => (
              <div className="trend-column" key={index}>
                <div className="trend-value" style={{ height: value + "%" }} />
                <span>{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <aside className="terminal-panel intelligence-side">
        <div className="terminal-section-head">
          <div>
            <span>Leituras da operação</span>
            <small>sinais demonstrativos</small>
          </div>
        </div>

        <div className="insight-list">
          <div>
            <span>01</span>
            <div><strong>Máquinas concentram 42% do interesse recente</strong><small>maior categoria na base demonstrativa</small></div>
          </div>
          <div>
            <span>02</span>
            <div><strong>CTR médio acima das campanhas anteriores</strong><small>crescimento ilustrativo de 2,1 p.p.</small></div>
          </div>
          <div>
            <span>03</span>
            <div><strong>18 contatos pedem acompanhamento</strong><small>com base em sinais de interação</small></div>
          </div>
        </div>
      </aside>
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
