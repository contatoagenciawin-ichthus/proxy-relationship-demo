"use client";

import { useEffect, useMemo, useRef, useState } from "react";

const roles = [
  {
    id: "patient",
    title: "Paciente",
    description: "Teste como alguém que procura o consultório diretamente.",
  },
  {
    id: "family",
    title: "Familiar ou cuidador",
    description: "Teste continuidade, paciência e contexto de quem ajuda outra pessoa.",
  },
  {
    id: "secretary",
    title: "Secretária / equipe",
    description: "Teste situações que normalmente chegam ao atendimento humano.",
  },
];

function ProxyMark() {
  return (
    <span className="conversation-proxy-mark" aria-hidden="true">
      <span />
    </span>
  );
}

function roleLabel(role) {
  return roles.find((item) => item.id === role)?.title || "Paciente";
}

export default function ConversationalDemo({ tenant }) {
  const [role, setRole] = useState("");
  const [engine, setEngine] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [status, setStatus] = useState("idle");
  const [handoff, setHandoff] = useState(false);
  const scrollRef = useRef(null);

  const lastUserMessages = useMemo(
    () => messages.filter((message) => message.role === "user"),
    [messages],
  );

  useEffect(() => {
    fetch("/api/conversational/respond", { cache: "no-store" })
      .then((response) => response.json())
      .then(setEngine)
      .catch(() => setEngine(null));
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, status]);

  function start(selectedRole) {
    setRole(selectedRole);
    setHandoff(false);
    setMessages([
      {
        id: "greeting",
        role: "assistant",
        content: tenant.greeting,
      },
    ]);
  }

  function reset() {
    setRole("");
    setMessages([]);
    setInput("");
    setStatus("idle");
    setHandoff(false);
  }

  async function sendMessage(textValue) {
    const text = (textValue ?? input).trim();
    if (!text || status === "loading") return;

    const userMessage = {
      id: `u-${Date.now()}`,
      role: "user",
      content: text,
    };

    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setStatus("loading");
    setHandoff(false);

    try {
      const response = await fetch("/api/conversational/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tenant: tenant.id,
          role,
          messages: nextMessages.map(({ role: messageRole, content }) => ({
            role: messageRole,
            content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        throw new Error(data?.message || "Não foi possível responder.");
      }

      setMessages((current) => [
        ...current,
        {
          id: `a-${Date.now()}`,
          role: "assistant",
          content: data.reply,
          mode: data.mode,
        },
      ]);
      setHandoff(Boolean(data.handoff));
      setStatus("idle");
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: `e-${Date.now()}`,
          role: "assistant",
          content:
            "Não consegui concluir esta resposta agora. Em uma operação real, eu encaminharia a conversa para uma pessoa da equipe em vez de deixar você sem atendimento.",
          error: true,
        },
      ]);
      setHandoff(true);
      setStatus("idle");
    }
  }

  if (!role) {
    return (
      <main className="conversation-demo-shell">
        <div className="conversation-demo-grid" aria-hidden="true" />

        <header className="conversation-demo-topbar">
          <a className="conversation-proxy-brand" href="/">
            <ProxyMark />
            <div>
              <strong>PROXY</strong>
              <span>CONVERSATIONAL DEMO</span>
            </div>
          </a>
          <span className="conversation-demo-badge">AMBIENTE DE TESTE</span>
        </header>

        <section className="conversation-demo-intro">
          <div className="conversation-intro-copy">
            <p className="conversation-kicker">ATENDIMENTO QUE PRESERVA O HUMANO</p>
            <h1>Converse como um paciente conversaria.</h1>
            <p className="conversation-intro-lead">
              Esta demonstração foi criada para avaliar uma coisa simples: se um atendente
              de IA consegue acolher, compreender e organizar o contato sem aumentar a
              frustração de quem está tentando falar com o consultório.
            </p>

            <div className="conversation-tenant-card">
              <span>DEMONSTRAÇÃO PREPARADA PARA</span>
              <strong>{tenant.brand}</strong>
              <small>{tenant.specialty}</small>
              <p>{tenant.description}</p>
            </div>

            <div className="conversation-safety-note">
              <strong>IMPORTANTE</strong>
              <p>
                Use situações fictícias. Não envie nomes completos, exames, diagnósticos,
                telefones ou outras informações reais de pacientes nesta demonstração.
              </p>
            </div>
          </div>

          <div className="conversation-role-card">
            <span className="conversation-kicker">COMO VOCÊ QUER TESTAR?</span>
            <h2>Escolha um papel e converse normalmente.</h2>
            <div className="conversation-role-options">
              {roles.map((item) => (
                <button type="button" key={item.id} onClick={() => start(item.id)}>
                  <span>{item.title}</span>
                  <small>{item.description}</small>
                  <b>COMEÇAR TESTE →</b>
                </button>
              ))}
            </div>
          </div>
        </section>

        <footer className="conversation-demo-footer">
          <span>PROXY TECHNOLOGY · HUMAN-CENTERED AI</span>
          <span>SEM DADOS REAIS</span>
        </footer>
      </main>
    );
  }

  return (
    <main className="conversation-experience-shell">
      <header className="conversation-experience-header">
        <a className="conversation-proxy-brand" href="/">
          <ProxyMark />
          <div>
            <strong>PROXY</strong>
            <span>CONVERSATIONAL DEMO</span>
          </div>
        </a>

        <div className="conversation-session-meta">
          <span>TESTANDO COMO</span>
          <strong>{roleLabel(role)}</strong>
        </div>

        <button type="button" onClick={reset}>
          TROCAR PERFIL
        </button>
      </header>

      <section className="conversation-experience-layout">
        <aside className="conversation-observer-panel">
          <span className="conversation-kicker">O QUE OBSERVAR</span>
          <h2>Não teste comandos. Teste comportamento.</h2>
          <p>
            Escreva como uma pessoa escreveria no WhatsApp. Interrompa, mude de assunto,
            demonstre impaciência, peça para falar com alguém ou diga que já explicou algo.
          </p>

          <div className="conversation-principles">
            {tenant.principles.map((principle) => (
              <div key={principle}>
                <span>✓</span>
                <p>{principle}</p>
              </div>
            ))}
          </div>

          <div className="conversation-engine-state">
            <span>
              {engine?.mode === "live" && engine?.liveConfigured
                ? "IA CONVERSACIONAL ATIVA"
                : "DEMO CONTROLADA"}
            </span>
            <small>
              {engine?.mode === "live" && engine?.liveConfigured
                ? "respostas geradas em tempo real"
                : "respostas seguras para validação da experiência"}
            </small>
          </div>
        </aside>

        <div className="conversation-phone-wrap">
          <div className="conversation-phone">
            <div className="conversation-phone-head">
              <div className="conversation-avatar">
                {tenant.brand
                  .split(" ")
                  .filter(Boolean)
                  .slice(-2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <strong>{tenant.brand}</strong>
                <span>{tenant.assistantLabel}</span>
              </div>
              <b>DEMO</b>
            </div>

            <div className="conversation-chat" ref={scrollRef}>
              <div className="conversation-chat-notice">
                Ambiente demonstrativo. Não envie dados médicos reais.
              </div>

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    "conversation-bubble-row " +
                    (message.role === "user" ? "user" : "assistant")
                  }
                >
                  <div className={"conversation-bubble " + (message.error ? "error" : "")}>
                    <p>{message.content}</p>
                    <span>
                      {message.role === "assistant" ? "assistente virtual" : "agora"}
                    </span>
                  </div>
                </div>
              ))}

              {status === "loading" && (
                <div className="conversation-bubble-row assistant">
                  <div className="conversation-bubble typing">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}

              {handoff && (
                <div className="conversation-handoff">
                  <span>CONTATO HUMANO FACILITADO</span>
                  <p>
                    Nesta situação, a operação real encaminharia a conversa para a equipe
                    preservando o contexto já informado.
                  </p>
                </div>
              )}
            </div>

            {lastUserMessages.length < 2 && (
              <div className="conversation-suggestions">
                {tenant.suggestedTests.slice(0, 4).map((suggestion) => (
                  <button
                    type="button"
                    key={suggestion}
                    onClick={() => sendMessage(suggestion)}
                    disabled={status === "loading"}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            <form
              className="conversation-compose"
              onSubmit={(event) => {
                event.preventDefault();
                sendMessage();
              }}
            >
              <input
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Escreva como você escreveria no WhatsApp..."
                maxLength={800}
                autoComplete="off"
              />
              <button type="submit" disabled={!input.trim() || status === "loading"}>
                ENVIAR
              </button>
            </form>
          </div>
        </div>

        <aside className="conversation-test-panel">
          <span className="conversation-kicker">IDEIAS PARA TESTAR</span>
          <div className="conversation-test-list">
            {tenant.suggestedTests.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => sendMessage(suggestion)}
                disabled={status === "loading"}
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="conversation-test-human">
            <span>UM TESTE IMPORTANTE</span>
            <p>
              Peça explicitamente para falar com a doutora ou com uma pessoa da equipe.
              O atendente não deve transformar a IA em uma barreira.
            </p>
            <button
              type="button"
              onClick={() => sendMessage("Eu quero falar com a Dra. Amanda.")}
              disabled={status === "loading"}
            >
              TESTAR PEDIDO HUMANO
            </button>
          </div>
        </aside>
      </section>
    </main>
  );
}
