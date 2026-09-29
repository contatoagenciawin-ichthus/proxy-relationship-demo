# Proxy Conversational Demo

## Objetivo

A Proxy Conversational Demo é uma experiência comercial diferente do Command Center.

Ela existe para prospects que precisam avaliar o comportamento do atendente, não entender a arquitetura do produto.

A pergunta central é:

> “Eu teria tranquilidade em deixar meus pacientes, clientes ou familiares conversando com este atendimento?”

## Primeiro tenant

Dra. Amanda Fialho · Geriatria

Rota:

`/conversational/amanda-fialho`

A rota `/conversational` também abre esse tenant enquanto ele é o piloto principal.

## Experiência

A pessoa escolhe testar como:

- paciente;
- familiar/cuidador;
- secretária/equipe.

Depois conversa normalmente, em uma interface mobile-first inspirada em mensageria.

A demonstração deve ser testada com linguagem espontânea, interrupções, pedidos de atendimento humano e sinais de frustração.

## Princípios do piloto Amanda

- uma pergunta por vez;
- não transformar IA em barreira para falar com a equipe;
- não repetir informações já fornecidas;
- reconhecer familiar/cuidador;
- aceitar respostas incompletas;
- recuperar frustração sem se defender;
- ser transparente de que é uma assistente virtual;
- não inventar agenda, preço ou disponibilidade;
- não diagnosticar, prescrever ou interpretar clinicamente;
- não receber dados médicos reais no ambiente público.

## Modos

### Preview

`CONVERSATIONAL_AI_MODE=preview`

Usa um motor seguro e determinístico para validar a experiência sem consumo de IA.

É o modo padrão da demo pública.

### Live

`CONVERSATIONAL_AI_MODE=live`

Usa `OPENAI_API_KEY` no servidor e o modelo definido em:

`CONVERSATIONAL_AI_MODEL`

O endpoint atual é:

`POST /api/conversational/respond`

O modo live não persiste a conversa.

## Segurança

O endpoint:

- limita a quantidade de mensagens enviadas ao modelo;
- limita o tamanho de cada mensagem;
- não grava a conversa no banco;
- não expõe a chave da OpenAI ao navegador;
- contém fronteiras explícitas para dúvidas clínicas;
- orienta emergência quando aparecem sinais que podem indicar risco imediato;
- nunca deve afirmar que uma ação real foi concluída quando está em uma demo.

## Evolução para WhatsApp real

A interface web é o primeiro gêmeo da experiência.

O próximo estágio conecta o mesmo motor a um número de demonstração da WhatsApp Business Platform.

Arquitetura prevista:

```
WhatsApp Business Platform
  ↓
Webhook Meta
  ↓
Normalização da mensagem
  ↓
Tenant conversacional
  ↓
Contexto + políticas + histórico de teste
  ↓
Motor conversacional
  ↓
Resposta
  ↓
Cloud API
```

### Primeira etapa real

O primeiro número de teste deve operar exclusivamente como ambiente demonstrativo.

A mensagem inicial deve deixar explícito que:

- é uma demonstração;
- não é atendimento médico real;
- não devem ser enviados dados, exames ou documentos reais;
- a pessoa pode testar situações fictícias.

## Separação do Command Center

A Conversational Demo não substitui a Demo Master.

São superfícies complementares:

```
Proxy Demo Platform
  ├── Demo Master
  │   └── gestores / empresas / visão de plataforma
  │
  └── Conversational Demo
      └── profissionais / atendimento / experiência pelo canal
```

## Próximos marcos

1. validar o comportamento com a equipe Proxy;
2. ativar modo live em preview privado;
3. testar frases livres e casos adversariais;
4. conectar um número de teste da Meta;
5. permitir acesso da Dra. Amanda pelo próprio WhatsApp;
6. coletar feedback de comportamento;
7. transformar o tenant em template reutilizável para clínicas e profissionais;
8. criar novos perfis para jurídico, veterinária, serviços e B2B.
