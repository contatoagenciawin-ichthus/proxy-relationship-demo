"use client";

import { useMemo, useState } from "react";

const steps = [
  ["overview", "Visão geral"],
  ["email", "E-mail"],
  ["contacts", "Base de contatos"],
  ["whatsapp", "WhatsApp"],
  ["results", "Resultados"],
];

const campaigns = [
  {
    title: "Novidades Texfield",
    segment: "Base comercial ativa",
    audience: 624,
    delivered: 608,
    clicks: 92,
    status: "ENVIADA",
  },
  {
    title: "Peças, assistência e reposição",
    segment: "Pós-venda",
    audience: 196,
    delivered: 191,
    clicks: 31,
    status: "ENVIADA",
  },
  {
    title: "Tecnologia em operação",
    segment: "Preparação e tecelagem",
    audience: 382,
    delivered: 371,
    clicks: 47,
    status: "ENVIADA",
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
    detail: "Contato identificado · interesse em peças · histórico vinculado",
    owner: "Comercial",
    time: "10:42",
  },
  {
    company: "Fiação Industrial Sul",
    message: "Temos uma dúvida técnica sobre o equipamento instalado.",
    detail: "Cliente ativo · histórico de assistência disponível",
    owner: "Equipe técnica",
    time: "09:18",
  },
  {
    company: "Têxtil Nova Era",
    message: "Gostaria de receber informações sobre máquinas disponíveis.",
    detail: "Prospect · interesse comercial · campanha relacionada",
    owner: "Comercial",
    time: "Ontem",
  },
];

const metrics = [
  ["1.248", "contatos organizados", "base demonstrativa"],
  ["3", "campanhas recentes", "e-mail"],
  ["94,6%", "entregas", "campanha selecionada"],
  ["92", "cliques", "interações registradas"],
];

function Status({ children }) {
  return <span className="tm-status">{children}</span>;
}

function Header({ currentStep, onStepChange }) {
  return (
    <>
      <div className="tm-topbar">
        <div className="tm-brand">
          <span className="tm-proxy-mark"><i /></span>
          <div>
            <strong>PROXY TECHNOLOGY</strong>
            <span>TEXFIELD · CENTRAL DE RELACIONAMENTO</span>
          </div>
        </div>
        <div className="tm-demo-label">
          <span>APRESENTAÇÃO COMERCIAL</span>
          <strong>DADOS ILUSTRATIVOS</strong>
        </div>
      </div>

      <nav className="tm-nav">
        {steps.map(([id, label], index) => (
          <button
            key={id}
            type="button"
            className={currentStep === index ? "active" : ""}
            onClick={() => onStepChange(index)}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {label}
          </button>
        ))}
      </nav>
    </>
  );
}

function Overview() {
  return (
    <section className="tm-screen">
      <div className="tm-screen-head">
        <div>
          <span className="tm-kicker">01 · VISÃO GERAL</span>
          <h1>Um canal próprio para relacionamento com o mercado.</h1>
          <p>
            Base, comunicações e histórico organizados em um único ambiente para apoiar
            o relacionamento recorrente da Texfield com clientes, prospects, parceiros
            e demais públicos estratégicos.
          </p>
        </div>
        <div className="tm-scope-box">
          <span>ESCOPO DA PROPOSTA</span>
          <strong>E-MAIL + WHATSAPP + DASHBOARD</strong>
          <small>implantação, organização da base e acompanhamento</small>
        </div>
      </div>

      <div className="tm-metrics">
        {metrics.map(([value, label, helper]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
            <small>{helper}</small>
          </div>
        ))}
      </div>

      <div className="tm-overview-grid">
        <article className="tm-panel">
          <div className="tm-panel-head">
            <span>ATIVIDADE RECENTE</span>
            <small>visão consolidada</small>
          </div>
          <div className="tm-activity">
            {[
              ["11:31", "Campanha aberta", "Malharia Santa Clara", "E-MAIL"],
              ["11:27", "Nova conversa", "Solicitação comercial recebida", "WHATSAPP"],
              ["11:18", "Clique registrado", "Têxtil Nova Era · equipamento", "INTERAÇÃO"],
              ["10:54", "Campanha entregue", "Novo lote aceito pelo serviço de envio", "E-MAIL"],
              ["10:41", "Contato atualizado", "Interesse principal: máquinas", "BASE"],
            ].map(([time, title, detail, channel]) => (
              <div key={time + title}>
                <time>{time}</time>
                <div><strong>{title}</strong><small>{detail}</small></div>
                <Status>{channel}</Status>
              </div>
            ))}
          </div>
        </article>

        <article className="tm-panel">
          <div className="tm-panel-head">
            <span>DO CONTEÚDO À OPORTUNIDADE</span>
            <small>fluxo de relacionamento</small>
          </div>
          <div className="tm-flow">
            {["CONTEÚDO", "SEGMENTAÇÃO", "ENVIO", "INTERAÇÃO", "HISTÓRICO", "OPORTUNIDADE"].map(
              (item, index) => (
                <div key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <strong>{item}</strong>
                </div>
              ),
            )}
          </div>
        </article>
      </div>
    </section>
  );
}

function Email() {
  const [selected, setSelected] = useState(0);
  const campaign = campaigns[selected];

  return (
    <section className="tm-screen">
      <div className="tm-screen-head compact">
        <div>
          <span className="tm-kicker">02 · E-MAIL</span>
          <h1>Comunicação recorrente, segmentada e mensurável.</h1>
          <p>
            A equipe escolhe o público, prepara a comunicação e acompanha os resultados
            disponibilizados pelo canal.
          </p>
        </div>
      </div>

      <div className="tm-email-grid">
        <aside className="tm-panel tm-campaign-list">
          <div className="tm-panel-head">
            <span>CAMPANHAS</span>
            <small>{campaigns.length} recentes</small>
          </div>
          {campaigns.map((item, index) => (
            <button
              type="button"
              key={item.title}
              className={selected === index ? "active" : ""}
              onClick={() => setSelected(index)}
            >
              <span>{item.status}</span>
              <strong>{item.title}</strong>
              <small>{item.segment}</small>
            </button>
          ))}
        </aside>

        <article className="tm-panel tm-email-detail">
          <div className="tm-panel-head">
            <span>PRÉVIA DA COMUNICAÇÃO</span>
            <Status>DEMONSTRATIVA</Status>
          </div>

          <div className="tm-email-preview">
            <div className="tm-email-preview-top">
              <strong>TEXFIELD</strong>
              <span>INFORMAÇÃO · TECNOLOGIA · INDÚSTRIA</span>
            </div>
            <div className="tm-email-hero">
              <small>RELACIONAMENTO COM O MERCADO</small>
              <h2>{campaign.title}</h2>
              <p>
                Máquinas, componentes, assistência e informações relevantes para apoiar
                a operação industrial e manter o relacionamento comercial ativo.
              </p>
              <button type="button">VER CONTEÚDO</button>
            </div>
          </div>

          <div className="tm-email-stats">
            <div><span>PÚBLICO</span><strong>{campaign.audience}</strong></div>
            <div><span>ENTREGUES</span><strong>{campaign.delivered}</strong></div>
            <div><span>CLIQUES</span><strong>{campaign.clicks}</strong></div>
            <div><span>SEGMENTO</span><strong>{campaign.segment}</strong></div>
          </div>
        </article>
      </div>
    </section>
  );
}

function Contacts() {
  const [selected, setSelected] = useState(contacts[1]);
  const [company, type, interest, city, status, last] = selected;

  return (
    <section className="tm-screen">
      <div className="tm-screen-head compact">
        <div>
          <span className="tm-kicker">03 · BASE DE CONTATOS</span>
          <h1>A base deixa de ser apenas uma lista.</h1>
          <p>
            Cada contato passa a reunir classificação, interesse e histórico de
            relacionamento para apoiar a continuidade comercial.
          </p>
        </div>
      </div>

      <div className="tm-contacts-grid">
        <article className="tm-panel">
          <div className="tm-panel-head">
            <span>CONTATOS</span>
            <small>1.248 registros demonstrativos</small>
          </div>
          <div className="tm-table tm-contact-table">
            <div className="tm-table-head">
              <span>EMPRESA</span><span>TIPO</span><span>INTERESSE</span><span>LOCAL</span><span>STATUS</span>
            </div>
            {contacts.map((row) => (
              <button type="button" key={row[0]} onClick={() => setSelected(row)} className={selected[0] === row[0] ? "active" : ""}>
                <strong>{row[0]}</strong><span>{row[1]}</span><span>{row[2]}</span><span>{row[3]}</span><Status>{row[4]}</Status>
              </button>
            ))}
          </div>
        </article>

        <aside className="tm-panel tm-contact-detail">
          <div className="tm-panel-head">
            <span>HISTÓRICO DO CONTATO</span>
            <small>{last}</small>
          </div>
          <div className="tm-contact-card">
            <small>EMPRESA</small>
            <h2>{company}</h2>
            <dl>
              <div><dt>Perfil</dt><dd>{type}</dd></div>
              <div><dt>Interesse</dt><dd>{interest}</dd></div>
              <div><dt>Local</dt><dd>{city}</dd></div>
              <div><dt>Status</dt><dd>{status}</dd></div>
            </dl>
          </div>
          <div className="tm-history">
            <div><span>E-MAIL</span><strong>Abriu “Novidades Texfield”</strong><small>Hoje · 09:54</small></div>
            <div><span>INTERAÇÃO</span><strong>Clicou em conteúdo de equipamento</strong><small>Hoje · 10:02</small></div>
            <div><span>BASE</span><strong>Interesse atualizado para {interest}</strong><small>Hoje · 10:18</small></div>
          </div>
        </aside>
      </div>
    </section>
  );
}

function WhatsApp() {
  const [selected, setSelected] = useState(0);
  const convo = conversations[selected];

  return (
    <section className="tm-screen">
      <div className="tm-screen-head compact">
        <div>
          <span className="tm-kicker">04 · WHATSAPP</span>
          <h1>Um canal complementar, ligado ao histórico do contato.</h1>
          <p>
            Conversas autorizadas podem ser associadas à base para que o atendimento
            continue com contexto e sem perder o vínculo com as comunicações anteriores.
          </p>
        </div>
      </div>

      <div className="tm-whatsapp-grid">
        <aside className="tm-panel tm-conversation-list">
          <div className="tm-panel-head">
            <span>CONVERSAS</span>
            <small>demonstrativas</small>
          </div>
          {conversations.map((item, index) => (
            <button type="button" key={item.company} className={selected === index ? "active" : ""} onClick={() => setSelected(index)}>
              <span>{item.time}</span>
              <strong>{item.company}</strong>
              <small>{item.message}</small>
            </button>
          ))}
        </aside>

        <article className="tm-panel tm-chat-panel">
          <div className="tm-panel-head">
            <div>
              <span>{convo.company}</span>
              <small>conversa associada à base</small>
            </div>
            <Status>{convo.owner}</Status>
          </div>
          <div className="tm-chat-body">
            <div className="tm-chat-context">
              <span>CONTEXTO DISPONÍVEL</span>
              <strong>{convo.detail}</strong>
            </div>
            <div className="tm-bubble incoming">
              <small>{convo.time}</small>
              <p>{convo.message}</p>
            </div>
            <div className="tm-bubble outgoing">
              <small>atendimento</small>
              <p>
                Olá. Recebemos sua mensagem e já localizamos o histórico deste contato.
                Vamos direcionar a solicitação ao responsável e continuar por aqui.
              </p>
            </div>
          </div>
          <div className="tm-chat-compose">
            <span>Responder pelo canal autorizado…</span>
            <button type="button">ENVIAR</button>
          </div>
        </article>

        <aside className="tm-panel tm-channel-context">
          <div className="tm-panel-head">
            <span>RELACIONAMENTO</span>
            <small>visão do contato</small>
          </div>
          <dl>
            <div><dt>Origem</dt><dd>Base Texfield</dd></div>
            <div><dt>Campanha relacionada</dt><dd>Novidades Texfield</dd></div>
            <div><dt>Interesse</dt><dd>Peças / máquinas</dd></div>
            <div><dt>Responsável</dt><dd>{convo.owner}</dd></div>
          </dl>
          <p>
            O objetivo é manter a comunicação organizada entre os canais sem expor
            complexidade técnica para quem opera o relacionamento.
          </p>
        </aside>
      </div>
    </section>
  );
}

function Results() {
  return (
    <section className="tm-screen">
      <div className="tm-screen-head">
        <div>
          <span className="tm-kicker">05 · RESULTADOS</span>
          <h1>O que a equipe consegue acompanhar em um único ambiente.</h1>
          <p>
            A leitura consolida base, envios, entregas, interações e histórico para
            transformar comunicação recorrente em relacionamento acompanhável.
          </p>
        </div>
        <div className="tm-scope-box">
          <span>OPERAÇÃO</span>
          <strong>PELA TEXFIELD OU PELA ICHTHUS</strong>
          <small>a plataforma pode ser operada diretamente pela equipe</small>
        </div>
      </div>

      <div className="tm-results-grid">
        <article className="tm-panel">
          <div className="tm-panel-head">
            <span>INDICADORES DISPONÍVEIS</span>
            <small>amostra demonstrativa</small>
          </div>
          <div className="tm-results-metrics">
            <div><span>BASE</span><strong>1.248</strong><small>contatos organizados</small></div>
            <div><span>ENTREGAS</span><strong>1.170</strong><small>últimas 3 campanhas</small></div>
            <div><span>CLIQUES</span><strong>170</strong><small>interações registradas</small></div>
            <div><span>WHATSAPP</span><strong>23</strong><small>conversas vinculadas</small></div>
          </div>
        </article>

        <article className="tm-panel">
          <div className="tm-panel-head">
            <span>LEITURA DO RELACIONAMENTO</span>
            <small>exemplo</small>
          </div>
          <div className="tm-result-bars">
            {[
              ["Máquinas", 42],
              ["Peças", 31],
              ["Assistência", 17],
              ["Outros", 10],
            ].map(([label, value]) => (
              <div key={label}>
                <div><span>{label}</span><strong>{value}%</strong></div>
                <i><b style={{ width: value + "%" }} /></i>
              </div>
            ))}
          </div>
        </article>

        <article className="tm-panel tm-closing-panel">
          <span className="tm-kicker">RESULTADO ESPERADO</span>
          <h2>Uma estrutura própria de relacionamento pronta para uso.</h2>
          <p>
            A Texfield passa a ter um ambiente organizado para trabalhar sua base,
            operar comunicações por e-mail e WhatsApp e acompanhar os resultados
            disponibilizados pelos canais integrados.
          </p>
          <div className="tm-closing-flow">
            {["BASE", "COMUNICAÇÃO", "INTERAÇÃO", "HISTÓRICO", "RELACIONAMENTO"].map((item, index) => (
              <div key={item}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item}</strong></div>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}

export default function TexfieldMarketingDemo() {
  const [step, setStep] = useState(0);
  const Current = useMemo(() => [Overview, Email, Contacts, WhatsApp, Results][step], [step]);

  return (
    <main className="tm-shell">
      <Header currentStep={step} onStepChange={setStep} />
      <Current />
      <footer className="tm-footer">
        <span>PROXY TECHNOLOGY · TEXFIELD · DEMONSTRAÇÃO COMERCIAL</span>
        <div>
          <button type="button" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
            ← ANTERIOR
          </button>
          <span>{String(step + 1).padStart(2, "0")} / 05</span>
          <button type="button" onClick={() => setStep(Math.min(4, step + 1))} disabled={step === 4}>
            PRÓXIMO →
          </button>
        </div>
      </footer>
    </main>
  );
}
