# Proxy Relationship Demo

Demonstração comercial reutilizável da plataforma de relacionamento, comunicação e inteligência da Proxy Technology.

## Estrutura atual

A aplicação possui dois modos de demonstração:

- **Demo Master pública**: `/` ou `/demo`
- **Demo personalizada**: `/demo/[tenant]`

A Demo Master usa a empresa fictícia **Atlas Industrial** e pode ser explorada sem acompanhamento comercial.

O tenant **Texfield** permanece disponível em:

`/demo/texfield`

Ele preserva a demonstração que validou o conceito comercial.

## Princípio arquitetural

Não criar um projeto separado por prospect.

Identidade, conteúdo e contexto comercial ficam associados ao tenant, enquanto interface, fluxos e infraestrutura permanecem compartilhados.

Metadados dos tenants:

`config/tenants.js`

Documento de operação e segurança da demo:

`docs/demo-platform.md`

## Stack

- Next.js 16
- React 19
- GitHub
- Vercel
- Neon para persistência editorial
- Vercel Blob para ativos visuais
- provider de e-mail desacoplado da interface

## Segurança da Demo Master

A experiência pública é preparada para navegação e simulação:

- dados e empresas são fictícios;
- e-mail e WhatsApp não devem enviar para destinatários arbitrários;
- geração real de imagem é bloqueada no tenant público;
- nenhuma credencial é exposta ao navegador;
- o estado da experiência pode ser restaurado com **Reiniciar demo**.

Integrações reais devem permanecer controladas em tenants personalizados ou ambientes autenticados.

## E-mail

O módulo possui dois modos:

- `preview`: valida interface, payload e template sem envio real;
- `live`: envia demonstrações pelo provider configurado.

O modo `live` usa `DEMO_ALLOWED_RECIPIENTS` para impedir disparos arbitrários.

Configuração:

```env
EMAIL_DELIVERY_MODE=preview
EMAIL_PROVIDER=brevo
DEMO_ALLOWED_RECIPIENTS=
BREVO_API_KEY=
BREVO_SENDER_NAME=
BREVO_SENDER_EMAIL=
BREVO_REPLY_TO=
```

## Inteligência editorial e imagem

Fluxo preparado:

```
Radar
→ tema
→ estrutura editorial
→ conteúdo multicanal
→ direção visual
→ geração de imagem
→ armazenamento
→ previews de E-mail / WhatsApp / LinkedIn
```

A rota de geração é:

`POST /api/editorial/generate-image`

Configuração:

```env
EDITORIAL_IMAGE_MODE=preview
OPENAI_API_KEY=
OPENAI_IMAGE_MODEL=
OPENAI_IMAGE_SIZE=1536x1024
OPENAI_IMAGE_QUALITY=low
OPENAI_IMAGE_FORMAT=jpeg
OPENAI_IMAGE_COMPRESSION=84
DEMO_IMAGE_MAX_PER_HOUR=8
BLOB_READ_WRITE_TOKEN=
DATABASE_URL=
DATABASE_URL_UNPOOLED=
```

A Demo Master não dispara a geração real pelo frontend. O visitante pode explorar direção visual, prompt e adaptação de canais sem consumir APIs pagas.

## Persistência editorial

Migration inicial:

`db/migrations/0001_editorial_intelligence.sql`

Tabelas:

- `editorial_topics`
- `editorial_assets`
- `editorial_channel_versions`
- `editorial_generation_logs`

## Branch atual

`feat/proxy-demo-platform`

## Próximas etapas

1. validar visualmente a Demo Master;
2. manter Texfield como tenant personalizado de referência;
3. criar novos tenants por configuração, não por fork;
4. criar um painel interno para gerar demos personalizadas;
5. adicionar sessão/telemetria para visitas públicas;
6. separar definitivamente ambiente demonstrativo de ambientes reais de clientes.
