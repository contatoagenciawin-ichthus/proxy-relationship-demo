"use client";

import { useEffect, useMemo, useState } from "react";

const navItems = [
  ["overview", "Visão geral"],
  ["email", "E-mails"],
  ["contacts", "Contatos"],
  ["whatsapp", "WhatsApp"],
  ["reports", "Relatórios"],
];

const campaigns = [
  {
    id: 1,
    title: "Urdideira Jupiter: tecnologia em operação",
    segment: "Clientes · Preparação e tecelagem",
    audience: 382,
    delivered: 371,
    clicks: 47,
    status: "Enviada",
  },
  {
    id: 2,
    title: "Novidades Texfield",
    segment: "Base comercial ativa",
    audience: 624,
    delivered: 608,
    clicks: 92,
    status: "Enviada",
  },
  {
    id: 3,
    title: "Peças, assistência e reposição",
    segment: "Clientes · Pós-venda",
    audience: 196,
    delivered: 191,
    clicks: 31,
    status: "Enviada",
  },
];

const contacts = [
  ["Tecelagem Horizonte", "Cliente", "Máquinas circulares", "Americana · SP", "Ativo"],
  ["Malharia Santa Clara", "Prospect", "Peças e reposição", "Brusque · SC", "Oportunidade"],
  ["Fiação Industrial Sul", "Cliente", "Assistência técnica", "Blumenau · SC", "Ativo"],
  ["Têxtil Nova Era", "Prospect", "Automação", "São Paulo · SP", "Em contato"],
  ["Confecções Aurora", "Cliente", "Componentes", "Goiânia · GO", "Ativo"],
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

function Metric({ label, value, helper }) {
  return (
    <div className="metric-card">
      <span className="metric-label">{label}</span>
      <strong>{value}</strong>
      <small>{helper}</small>
    </div>
  );
}

function Overview({ setSection }) {
  return (
    <>
      <section className="hero-panel">
        <div>
          <span className="eyebrow">Relacionamento comercial</span>
          <h1>Visão consolidada dos canais da Texfield.</h1>
          <p>
            E-mail, contatos, interações e atendimento em um ambiente criado para acompanhar
            relacionamento e oportunidades sem depender de ferramentas isoladas.
          </p>
        </div>
        <button className="primary-button" onClick={() => setSection("email")}>
          Ver campanhas
        </button>
      </section>

      <section className="metrics-grid">
        <Metric label="Contatos" value="1.248" helper="+36 nos últimos 30 dias" />
        <Metric label="Entregabilidade" value="96,8%" helper="nas campanhas recentes" />
        <Metric label="Cliques" value="170" helper="interações mensuráveis" />
        <Metric label="Oportunidades" value="18" helper="sinalizadas para acompanhamento" />
      </section>

      <section className="content-grid">
        <div className="panel panel-large">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">E-mail</span>
              <h2>Campanhas recentes</h2>
            </div>
            <button className="text-button" onClick={() => setSection("email")}>Ver todas</button>
          </div>
          <div className="campaign-list">
            {campaigns.map((campaign) => (
              <div className="campaign-row" key={campaign.id}>
                <div>
                  <strong>{campaign.title}</strong>
                  <span>{campaign.segment}</span>
                </div>
                <div className="campaign-stat">
                  <small>Entregues</small>
                  <b>{campaign.delivered}</b>
                </div>
                <div className="campaign-stat">
                  <small>Cliques</small>
                  <b>{campaign.clicks}</b>
                </div>
                <span className="status success">{campaign.status}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">WhatsApp</span>
              <h2>Atendimento prioritário</h2>
            </div>
          </div>
          <div className="priority-stack">
            <div className="priority-item">
              <span className="priority-dot high" />
              <div><strong>2 oportunidades comerciais</strong><small>pedem acompanhamento</small></div>
            </div>
            <div className="priority-item">
              <span className="priority-dot" />
              <div><strong>7 conversas abertas</strong><small>na fila de atendimento</small></div>
            </div>
            <div className="priority-item">
              <span className="priority-dot" />
              <div><strong>1 atendimento técnico</strong><small>aguardando retorno</small></div>
            </div>
          </div>
          <button className="secondary-button full" onClick={() => setSection("whatsapp")}>
            Abrir atendimento
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

  function focusDemoSend() {
    document.getElementById("demo-recipient")?.focus();
  }

  return (
    <section className="split-view">
      <div className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Campanhas</span>
            <h2>E-mails enviados</h2>
          </div>
          <button className="primary-button small" onClick={focusDemoSend}>
            Enviar demonstração
          </button>
        </div>

        <div className="email-engine-strip">
          <span className={"engine-dot " + (engine?.mode === "live" ? "live" : "")} />
          <div>
            <strong>
              Motor de e-mail · {engine?.mode === "live" ? "envio habilitado" : "modo preview"}
            </strong>
            <small>
              {engine?.mode === "live"
                ? "Envios reais são limitados a endereços autorizados."
                : "O fluxo pode ser testado sem disparar mensagens reais."}
            </small>
          </div>
        </div>

        <div className="campaign-list">
          {campaigns.map((campaign) => (
            <button
              className={"campaign-row campaign-button " + (selected.id === campaign.id ? "selected" : "")}
              key={campaign.id}
              onClick={() => setSelected(campaign)}
            >
              <div>
                <strong>{campaign.title}</strong>
                <span>{campaign.segment}</span>
              </div>
              <span className="status success">{campaign.status}</span>
            </button>
          ))}
        </div>

        <form className="demo-send-card" onSubmit={handleDemoSend}>
          <div>
            <span className="eyebrow">Teste controlado</span>
            <h3>Receber esta demonstração por e-mail</h3>
            <p>
              Informe um endereço para validar o fluxo. Em modo live, o sistema
              só envia para destinatários previamente autorizados.
            </p>
          </div>

          <div className="demo-send-form">
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
              className="primary-button"
              type="submit"
              disabled={delivery.status === "loading"}
            >
              {delivery.status === "loading" ? "Processando..." : "Enviar teste"}
            </button>
          </div>

          {delivery.status !== "idle" && (
            <div
              className={
                "delivery-result " +
                (delivery.status === "error"
                  ? "error"
                  : delivery.delivered
                    ? "delivered"
                    : "preview")
              }
              role="status"
            >
              <strong>
                {delivery.status === "error"
                  ? "Envio não concluído"
                  : delivery.delivered
                    ? "Mensagem enviada"
                    : "Preview validado"}
              </strong>
              <span>{delivery.message}</span>
              {delivery.messageId && (
                <small>Referência: {delivery.messageId}</small>
              )}
            </div>
          )}
        </form>
      </div>

      <div className="panel email-preview">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Detalhes da campanha</span>
            <h2>{selected.title}</h2>
          </div>
        </div>

        <div className="email-metrics">
          <Metric label="Enviados" value={selected.audience} helper="destinatários" />
          <Metric label="Entregues" value={selected.delivered} helper="mensagens aceitas" />
          <Metric label="Cliques" value={selected.clicks} helper="interações registradas" />
        </div>

        <div className="email-frame">
          <div className="email-brand">TEXFIELD</div>
          <span className="email-kicker">SOLUÇÕES PARA A INDÚSTRIA TÊXTIL</span>
          <h3>{selected.title}</h3>
          <p>
            Máquinas, componentes, assistência e tecnologia para apoiar a
            operação industrial e manter o relacionamento comercial ativo.
          </p>
          <button className="email-cta" type="button">Falar com a Texfield</button>
          <small>Exemplo visual para demonstração comercial.</small>
        </div>
      </div>
    </section>
  );
}

function ContactsSection() {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Base de relacionamento</span>
          <h2>Contatos e segmentação</h2>
        </div>
        <button className="primary-button small">Adicionar contato</button>
      </div>

      <div className="filters">
        <span className="filter active">Todos · 1.248</span>
        <span className="filter">Clientes · 786</span>
        <span className="filter">Prospects · 312</span>
        <span className="filter">Parceiros · 150</span>
      </div>

      <div className="data-table">
        <div className="table-row table-head">
          <span>Empresa</span><span>Tipo</span><span>Interesse</span><span>Região</span><span>Status</span>
        </div>
        {contacts.map((contact) => (
          <div className="table-row" key={contact[0]}>
            {contact.map((cell, index) => (
              <span key={cell} className={index === 4 ? "status neutral" : ""}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}

function WhatsAppSection() {
  const [selected, setSelected] = useState(conversations[0]);

  return (
    <section className="whatsapp-layout">
      <div className="panel conversation-list">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">WhatsApp</span>
            <h2>Fila de atendimento</h2>
          </div>
        </div>
        {conversations.map((conversation) => (
          <button
            key={conversation.company}
            onClick={() => setSelected(conversation)}
            className={"conversation-item " + (selected.company === conversation.company ? "selected" : "")}
          >
            <div className="conversation-topline">
              <strong>{conversation.company}</strong>
              <small>{conversation.time}</small>
            </div>
            <span>{conversation.message}</span>
            <div className="conversation-meta">
              <small>{conversation.category}</small>
              <small className={conversation.priority === "Alta" ? "priority-high" : ""}>
                {conversation.priority}
              </small>
            </div>
          </button>
        ))}
      </div>

      <div className="panel chat-panel">
        <div className="chat-header">
          <div>
            <strong>{selected.company}</strong>
            <span>Cliente identificado · histórico disponível</span>
          </div>
          <span className="status warning">Prioridade {selected.priority}</span>
        </div>

        <div className="chat-body">
          <div className="message incoming">{selected.message}</div>
          <div className="system-card">
            <span>Contexto identificado</span>
            <strong>Categoria: {selected.category}</strong>
            <small>Responsável sugerido: {selected.owner}</small>
          </div>
          <div className="message outgoing">
            Olá! Recebemos sua mensagem. Vou direcionar sua solicitação para o responsável e seguimos por aqui.
          </div>
        </div>

        <div className="chat-compose">
          <input value="Digite uma resposta..." readOnly />
          <button>Enviar</button>
        </div>
      </div>

      <aside className="panel contact-context">
        <span className="eyebrow">Contexto comercial</span>
        <h3>{selected.company}</h3>
        <dl>
          <div><dt>Perfil</dt><dd>Cliente / prospect</dd></div>
          <div><dt>Interesse</dt><dd>{selected.category}</dd></div>
          <div><dt>Responsável</dt><dd>{selected.owner}</dd></div>
          <div><dt>Último e-mail</dt><dd>Novidades Texfield</dd></div>
          <div><dt>Interação</dt><dd>Clique registrado</dd></div>
        </dl>
      </aside>
    </section>
  );
}

function ReportsSection() {
  const rows = [
    ["Entregabilidade média", "96,8%", "+1,2 p.p."],
    ["CTR médio", "12,4%", "+2,1 p.p."],
    ["Base ativa", "1.248", "+36"],
    ["Descadastros", "0,7%", "-0,2 p.p."],
  ];

  return (
    <section className="content-grid reports-grid">
      <div className="panel panel-large">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Desempenho</span>
            <h2>Indicadores do canal de e-mail</h2>
          </div>
          <span className="period">Últimos 30 dias</span>
        </div>
        <div className="report-bars">
          {[72, 48, 84, 63, 91, 70, 78, 88].map((value, index) => (
            <div className="bar-wrap" key={index}>
              <div className="bar" style={{ height: value + "%" }} />
              <small>{index + 1}</small>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <span className="eyebrow">Resumo</span>
        <h2>Métricas principais</h2>
        <div className="report-list">
          {rows.map((row) => (
            <div key={row[0]}>
              <span>{row[0]}</span>
              <strong>{row[1]}</strong>
              <small>{row[2]}</small>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function DemoShell({ tenant }) {
  const [section, setSection] = useState("overview");

  const activeLabel = useMemo(
    () => navItems.find(([key]) => key === section)?.[1] || "Visão geral",
    [section]
  );

  return (
    <main className="app-shell" style={{ "--accent": tenant.accent, "--accent-soft": tenant.accentSoft }}>
      <aside className="sidebar">
        <div className="brand-block">
          <div className="brand-mark">{tenant.initials}</div>
          <div>
            <strong>{tenant.brand}</strong>
            <span>{tenant.productName}</span>
          </div>
        </div>

        <nav>
          {navItems.map(([key, label]) => (
            <button key={key} className={section === key ? "active" : ""} onClick={() => setSection(key)}>
              <span className="nav-dot" />
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span>Proxy Technology</span>
          <small>Relationship Platform</small>
        </div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <div>
            <span className="breadcrumb">Texfield / {activeLabel}</span>
            <strong>{tenant.subtitle}</strong>
          </div>
          <span className="demo-badge">{tenant.demoLabel}</span>
        </header>

        <div className="page-content">
          {section === "overview" && <Overview setSection={setSection} />}
          {section === "email" && <EmailSection />}
          {section === "contacts" && <ContactsSection />}
          {section === "whatsapp" && <WhatsAppSection />}
          {section === "reports" && <ReportsSection />}
        </div>
      </div>
    </main>
  );
}
