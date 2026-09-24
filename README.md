# Proxy Relationship Demo

Demonstração comercial reutilizável da plataforma de relacionamento da Proxy Technology.

## Primeiro tenant

**Texfield** — representação e fornecimento de máquinas, peças e soluções para a indústria têxtil.

A aplicação apresenta, com dados ilustrativos:

- visão geral da operação;
- campanhas e métricas de e-mail;
- contatos e segmentações;
- atendimento prioritário via WhatsApp;
- relatórios de relacionamento.

## Arquitetura

A interface não é codificada como um produto exclusivo da Texfield. A configuração do tenant fica em `config/tenants.js`, permitindo reaproveitar o mesmo demo com identidade, conteúdo e módulos diferentes.

### Stack

- Next.js 16
- React 19
- GitHub
- Vercel
- Neon quando persistência real for necessária

Nesta primeira etapa não existe banco de dados. Os dados são demonstrativos e ficam no frontend para reduzir complexidade antes da validação comercial.

## Branch de desenvolvimento

`feat/texfield-demo-v1`

## Próximas etapas

1. validar experiência visual e narrativa comercial;
2. publicar preview na Vercel;
3. incorporar identidade visual definitiva da Texfield;
4. tornar o envio de e-mail realmente funcional;
5. registrar eventos de entrega e clique;
6. adicionar Neon quando a demonstração precisar persistir campanhas, contatos e eventos;
7. integrar WhatsApp apenas na camada operacional seguinte.


## Demonstração de e-mail

O módulo de e-mail possui dois modos:

- `preview`: valida interface, payload e template sem enviar mensagens;
- `live`: envia uma mensagem transacional de demonstração pelo provider configurado.

O primeiro provider implementado é a Brevo, seguindo o padrão já homologado no projeto Eduardo Brasil. A interface, porém, não depende diretamente da Brevo.

Por segurança, o modo `live` só envia para endereços presentes em `DEMO_ALLOWED_RECIPIENTS`. Isso impede que um ambiente público de demonstração seja usado para disparos arbitrários.

Configuração:

```env
EMAIL_DELIVERY_MODE=preview
EMAIL_PROVIDER=brevo
DEMO_ALLOWED_RECIPIENTS=
BREVO_API_KEY=
BREVO_SENDER_NAME=Texfield
BREVO_SENDER_EMAIL=
BREVO_REPLY_TO=
TEXFIELD_DEMO_CTA_URL=https://texfield.com.br
```

As credenciais são exclusivamente server-side. Nenhuma chave de provider é exposta ao navegador.

Nesta fase, campanhas, contatos e métricas comerciais continuam demonstrativos. O próximo passo de persistência será feito em Neon quando houver necessidade de armazenar tenants, campanhas, contatos ou eventos.


## Editorial Intelligence: geração de imagem

A área **Inteligência** possui uma integração server-side preparada para geração contextual de imagens.

Fluxo:

```
Radar setorial
→ tema
→ estrutura editorial
→ prompt visual
→ OpenAI Images
→ Vercel Blob
→ metadados no Neon
→ preview em E-mail / WhatsApp / LinkedIn
```

### Modos

- `EDITORIAL_IMAGE_MODE=preview`: valida o prompt e a experiência sem gerar imagem.
- `EDITORIAL_IMAGE_MODE=live`: chama a OpenAI, armazena o arquivo e registra o ativo.

A rota é `POST /api/editorial/generate-image`.

A integração usa por padrão `gpt-image-2.5-flare`, mas o modelo é configurável por `OPENAI_IMAGE_MODEL`.

O limite demonstrativo é controlado por `DEMO_IMAGE_MAX_PER_HOUR` e depende do Neon em modo live para impedir geração pública ilimitada.

### Persistência

A migration inicial está em:

```
db/migrations/0001_editorial_intelligence.sql
```

Ela cria:

- `editorial_topics`
- `editorial_assets`
- `editorial_channel_versions`
- `editorial_generation_logs`

A aplicação continua compilando sem credenciais porque os recursos externos são inicializados apenas em runtime.
