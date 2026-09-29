const MAX_MESSAGES = 14;
const MAX_MESSAGE_LENGTH = 900;

export function normalizeConversationMessages(input) {
  if (!Array.isArray(input)) return [];
  return input
    .filter(
      (item) =>
        item &&
        (item.role === "user" || item.role === "assistant") &&
        typeof item.content === "string",
    )
    .slice(-MAX_MESSAGES)
    .map((item) => ({
      role: item.role,
      content: item.content.trim().slice(0, MAX_MESSAGE_LENGTH),
    }))
    .filter((item) => item.content);
}

function includesAny(text, terms) {
  return terms.some((term) => text.includes(term));
}

export function previewConversationReply({ role, messages }) {
  const last = messages.filter((message) => message.role === "user").at(-1)?.content || "";
  const text = last.toLocaleLowerCase("pt-BR");

  if (
    includesAny(text, [
      "dor no peito",
      "falta de ar",
      "não responde",
      "nao responde",
      "desmaiou",
      "desmaio",
      "inconsciente",
      "convuls",
      "sangramento",
      "suicid",
      "quer morrer",
      "risco imediato",
    ])
  ) {
    return {
      reply:
        "Sinto muito que vocês estejam passando por isso. Esta demonstração não consegue avaliar uma urgência médica. Se houver risco imediato ou piora importante, procure um serviço de emergência ou ligue para o SAMU pelo 192. Se não for uma situação de emergência, posso ajudar a organizar um pedido de contato com a equipe da Dra. Amanda.",
      handoff: true,
      intent: "possible_urgent_health_issue",
    };
  }

  if (
    includesAny(text, [
      "remédio",
      "remedio",
      "medicamento",
      "dose",
      "posso parar",
      "posso tomar",
      "diagnóstico",
      "diagnostico",
      "o que eu tenho",
      "resultado do exame",
      "interpreta",
    ])
  ) {
    return {
      reply:
        "Posso ajudar a organizar sua dúvida para a equipe, mas não devo orientar mudança de medicamento, dose, diagnóstico ou interpretação clínica. Se você quiser, registro a sua pergunta para que seja avaliada pela Dra. Amanda ou pela equipe responsável.",
      handoff: true,
      intent: "clinical_question",
    };
  }

  if (
    includesAny(text, [
      "não quero falar com robô",
      "nao quero falar com robo",
      "quero uma pessoa",
      "falar com uma pessoa",
      "falar com a doutora",
      "falar com a dra",
      "falar com amanda",
      "quero falar com ela",
    ])
  ) {
    return {
      reply:
        "Claro. Não vou dificultar esse contato. Posso registrar seu pedido para falar com a Dra. Amanda ou com alguém da equipe. Se preferir, você não precisa explicar o motivo agora. Quer que eu registre apenas o pedido de retorno?",
      handoff: true,
      intent: "human_handoff",
    };
  }

  if (
    includesAny(text, [
      "já falei",
      "ja falei",
      "já disse",
      "ja disse",
      "já mandei",
      "ja mandei",
      "de novo",
      "outra vez",
    ])
  ) {
    return {
      reply:
        "Você tem razão, essa informação não deveria ser pedida novamente. Vou considerar o que já foi informado e continuar a partir daqui. O que você gostaria que acontecesse agora: organizar um retorno da equipe ou seguir com outra solicitação?",
      handoff: false,
      intent: "frustration_recovery",
    };
  }

  if (
    includesAny(text, [
      "sou filha",
      "sou filho",
      "minha mãe",
      "minha mae",
      "meu pai",
      "familiar",
      "cuidador",
      "cuidadora",
    ])
  ) {
    return {
      reply:
        "Entendi. Obrigada por me explicar que você está falando como familiar ou cuidador. Posso ajudar a organizar o contato sem exigir que a paciente repita tudo. Qual é a principal coisa que você precisa resolver agora?",
      handoff: false,
      intent: "family_or_caregiver",
    };
  }

  if (
    includesAny(text, [
      "exame",
      "laudo",
      "resultado",
      "documento",
      "foto do exame",
      "mandar arquivo",
      "enviar arquivo",
    ])
  ) {
    return {
      reply:
        "Posso registrar que você precisa encaminhar documentos para a equipe. Como este é um ambiente de demonstração, não envie exames nem informações reais por aqui. Na operação do consultório, o atendente orientaria o canal correto e manteria o pedido ligado ao histórico da paciente.",
      handoff: false,
      intent: "documents",
    };
  }

  if (
    includesAny(text, [
      "marcar",
      "agendar",
      "consulta",
      "horário",
      "horario",
      "retorno",
      "agenda",
    ])
  ) {
    return {
      reply:
        "Claro, posso ajudar a organizar o pedido de consulta. Nesta demonstração a agenda real não está conectada. Para simular o atendimento, me diga apenas uma coisa: você prefere manhã ou tarde?",
      handoff: false,
      intent: "scheduling",
    };
  }

  if (includesAny(text, ["manhã", "manha", "tarde", "noite"])) {
    return {
      reply:
        "Perfeito. Eu registraria essa preferência e consultaria os horários disponíveis antes de oferecer opções. Como a agenda real não está conectada à demo, posso simular o próximo passo sem inventar disponibilidade.",
      handoff: false,
      intent: "scheduling_preference",
    };
  }

  if (role === "secretary") {
    return {
      reply:
        "Entendi. Como membro da equipe, você pode testar como o atendente organiza contexto, identifica intenção e prepara um encaminhamento sem expor o paciente a menus ou perguntas repetitivas. Envie uma situação como ela chegaria pelo WhatsApp.",
      handoff: false,
      intent: "staff_test",
    };
  }

  return {
    reply:
      "Entendi. Vou seguir com calma e sem fazer você repetir informações desnecessariamente. Posso ajudar a organizar a solicitação, registrar um recado ou facilitar o contato com a equipe. O que você gostaria de resolver primeiro?",
    handoff: false,
    intent: "general_support",
  };
}

function buildInstructions(tenant, role) {
  const roleLabel =
    role === "family"
      ? "familiar ou cuidador"
      : role === "secretary"
        ? "membro da equipe/secretaria"
        : "paciente";

  return `
Você é a assistente virtual de demonstração de ${tenant.brand}, ${tenant.specialty}.
A pessoa está testando a experiência como ${roleLabel} pelo WhatsApp.

OBJETIVO
Demonstrar um atendimento acolhedor, paciente, claro e eficiente, sem criar barreiras para contato humano.

COMPORTAMENTO
- Diga a verdade: você é uma assistente virtual.
- Use português do Brasil.
- Seja calorosa sem ser melosa, infantil ou excessivamente formal.
- Faça no máximo uma pergunta por mensagem, salvo quando a segurança exigir instrução imediata.
- Não use menus numerados como padrão.
- Não peça novamente algo já presente na conversa.
- Se a pessoa demonstrar frustração, reconheça o ponto específico e continue sem se defender.
- Se pedir uma pessoa, a médica ou a equipe, facilite o handoff. Não tente prender a conversa.
- Se a pessoa não quiser explicar o motivo, respeite.
- Se for familiar/cuidador, reconheça esse contexto e ajude a organizar o contato.
- Não invente agenda, preço, disponibilidade, políticas, nomes, diagnósticos ou fatos ausentes.
- Não diga que enviou, marcou, alterou ou registrou algo no mundo real. Esta é uma demonstração.
- Lembre quando apropriado que não devem ser enviados dados ou documentos médicos reais neste ambiente de teste.

LIMITES CLÍNICOS
- Não diagnostique.
- Não interprete exames clinicamente.
- Não prescreva nem sugira alteração de medicamentos ou doses.
- Não substitua avaliação médica.
- Em sinais que possam representar risco imediato, diga que a demo não avalia urgência e oriente procurar serviço de emergência ou SAMU 192.
- Para dúvidas clínicas não urgentes, organize a pergunta para avaliação da médica/equipe.

CONTEXTO
${tenant.practiceContext.map((item) => "- " + item).join("\n")}

PRINCÍPIOS
${tenant.principles.map((item) => "- " + item).join("\n")}

Responda naturalmente, normalmente em 1 a 3 parágrafos curtos.
`.trim();
}

async function generateLiveConversationReply({ tenant, role, messages }) {
  const model = process.env.CONVERSATIONAL_AI_MODEL?.trim() || "gpt-5.6-luna";
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      instructions: buildInstructions(tenant, role),
      input: messages,
      max_output_tokens: 320,
      reasoning: { effort: "low" },
    }),
    signal: AbortSignal.timeout(25000),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error?.message || "OpenAI request failed");
  }

  const outputText =
    data.output_text ||
    data.output
      ?.flatMap((item) => item.content || [])
      .filter((item) => item.type === "output_text")
      .map((item) => item.text)
      .join("\n")
      .trim();

  if (!outputText) throw new Error("Empty conversational response");

  return { reply: outputText, model, handoff: false, intent: "model_generated" };
}

export async function respondConversationally({ tenant, role, messages }) {
  const normalized = normalizeConversationMessages(messages);
  if (!normalized.length || normalized.at(-1)?.role !== "user") {
    throw new Error("A conversa precisa terminar com uma mensagem do usuário.");
  }

  const mode = process.env.WHATSAPP_DEMO_AI_MODE === "live" ? "live" : "preview";

  if (mode !== "live" || !process.env.OPENAI_API_KEY?.trim()) {
    return {
      mode: "preview",
      generated: false,
      ...previewConversationReply({ role, messages: normalized }),
    };
  }

  const live = await generateLiveConversationReply({ tenant, role, messages: normalized });
  return { mode: "live", generated: true, ...live };
}
