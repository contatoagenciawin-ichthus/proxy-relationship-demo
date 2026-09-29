# Proxy Demo Platform

A demonstração comercial da Proxy passa a ser tratada como uma plataforma reutilizável, e não como um projeto exclusivo de um prospect.

## Modos de uso

### 1. Demo Master pública

Rota: `/` ou `/demo`

Usa a empresa fictícia **Atlas Industrial**. Foi desenhada para ficar online continuamente e poder ser explorada sem acompanhamento comercial.

Regras:

- dados, empresas, contatos e métricas são fictícios;
- e-mail e WhatsApp não disparam mensagens reais na experiência pública;
- geração de imagem real fica bloqueada no tenant público;
- o usuário pode navegar e simular fluxos sem alterar dados de outro visitante;
- o botão **Reiniciar demo** restaura o estado inicial da sessão.

### 2. Demo personalizada por tenant

Rota: `/demo/[tenant]`

Exemplo existente:

`/demo/texfield`

A interface e a arquitetura são as mesmas da Demo Master, mas branding, conteúdo, radar, campanhas, exemplos e linguagem podem ser ajustados ao prospect.

O tenant Texfield preserva a demonstração que validou o conceito comercial.

### 3. Ambiente real do cliente

Não deve compartilhar dados, credenciais ou integrações com o ambiente público de demonstração.

A produção do cliente terá autenticação, integrações reais, persistência, limites e permissões próprios.

## O que permanece na Demo Master

- visão geral da operação;
- contatos e sinais comerciais;
- campanhas de e-mail;
- fila de WhatsApp;
- inteligência de relacionamento;
- radar de mercado;
- estrutura editorial;
- adaptação para e-mail, WhatsApp e LinkedIn;
- experiência visual Command Center.

## O que não deve ficar aberto anonimamente

- importação de listas;
- disparo real para destinatários arbitrários;
- conexão de contas Meta;
- envio de WhatsApp;
- geração ilimitada por APIs pagas;
- dados reais de clientes;
- credenciais ou detalhes de infraestrutura.

## Arquitetura de tenant

Os metadados ficam em `config/tenants.js`.

O componente principal resolve um perfil de demonstração por tenant e preserva a mesma aplicação. Novos prospects devem ser adicionados como configuração e conteúdo, não como forks independentes do produto.

## Próxima evolução

Criar um painel interno da Proxy para gerar uma demonstração personalizada a partir de:

- empresa;
- site;
- segmento;
- identidade visual;
- contato principal;
- idioma.

O objetivo é produzir uma URL personalizada sem alterar o núcleo da aplicação.


## Camada de identidade Proxy

A Demo Master não deve parecer um produto isolado. Ela usa uma camada externa alinhada ao site institucional da Proxy:

- fundo preto;
- grid técnico;
- acento ciano;
- marca Proxy com quadrado ciano;
- microcopy em caixa alta e tipografia monoespaçada;
- bordas finas e alto contraste;
- transição visual para o Command Center sem redesenhar o produto operacional.

Nos tenants personalizados, o cliente continua sendo a organização apresentada, mas a aplicação exibe claramente **Proxy Relationship Intelligence** e **Powered by Proxy Technology**.

## Estratégia de domínio

Enquanto o domínio próprio da Proxy não estiver definido, o site institucional continua em:

`https://proxy.ichthusmkt.com.br/`

A origem institucional usada pela demo é configurável por:

```env
NEXT_PUBLIC_PROXY_SITE_URL=https://proxy.ichthusmkt.com.br
```

Quando o domínio próprio entrar, a aplicação não precisa ser reconstruída. Basta atualizar essa variável e configurar o domínio da demo na Vercel.

Estrutura recomendada:

```
dominio-da-proxy.com.br
→ site institucional

demo.dominio-da-proxy.com.br
→ Demo Master

demo.dominio-da-proxy.com.br/texfield
→ tenant personalizado

app.dominio-da-proxy.com.br
→ futura plataforma operacional
```

O projeto da demo deve permanecer separado tecnicamente do site institucional, ainda que visualmente faça parte do mesmo ecossistema.
