export const metadata = {
  title: "Testar no WhatsApp | Proxy Conversational Demo",
  description:
    "Acesso controlado à demonstração conversacional da Proxy pelo WhatsApp.",
};

function buildWhatsAppUrl(number, message) {
  const digits = String(number || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export default function WhatsAppConversationalDemoPage() {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_DEMO_NUMBER?.trim() || "";

  const patientUrl = buildWhatsAppUrl(
    number,
    "Olá. Quero testar a demonstração como paciente.",
  );
  const familyUrl = buildWhatsAppUrl(
    number,
    "Olá. Quero testar a demonstração como familiar ou cuidador.",
  );

  return (
    <main className="whatsapp-demo-entry">
      <header className="whatsapp-demo-entry-head">
        <a href="/conversational/amanda-fialho">
          <span className="whatsapp-demo-proxy-mark"><i /></span>
          <div>
            <strong>PROXY</strong>
            <small>CONVERSATIONAL DEMO</small>
          </div>
        </a>
        <span>WHATSAPP PILOT</span>
      </header>

      <section className="whatsapp-demo-entry-body">
        <div>
          <p className="conversation-kicker">DRA. AMANDA FIALHO · GERIATRIA</p>
          <h1>Agora o teste pode acontecer no próprio WhatsApp.</h1>
          <p className="whatsapp-demo-entry-lead">
            O objetivo não é testar comandos. Converse como um paciente ou familiar
            conversaria com o consultório e observe se o atendimento preserva calma,
            contexto e acesso humano.
          </p>

          <div className="whatsapp-demo-warning">
            <strong>AMBIENTE DEMONSTRATIVO</strong>
            <p>
              Use apenas situações fictícias. Não envie nome completo de paciente,
              exames, diagnósticos, documentos, telefones ou outras informações de
              saúde reais.
            </p>
          </div>
        </div>

        <aside className="whatsapp-demo-launch-card">
          <span>ACESSO CONTROLADO</span>
          {patientUrl ? (
            <>
              <h2>Escolha como quer iniciar a conversa.</h2>
              <a href={patientUrl}>TESTAR COMO PACIENTE →</a>
              <a href={familyUrl} className="secondary">
                TESTAR COMO FAMILIAR/CUIDADOR →
              </a>
              <p>
                Somente números previamente autorizados pela Proxy recebem respostas
                durante o piloto.
              </p>
            </>
          ) : (
            <>
              <h2>Número de demonstração ainda não conectado.</h2>
              <p>
                A experiência web já está disponível. O canal WhatsApp será liberado
                quando o número de teste da Meta e o webhook forem vinculados.
              </p>
              <a href="/conversational/amanda-fialho">ABRIR DEMO WEB →</a>
            </>
          )}
        </aside>
      </section>
    </main>
  );
}
