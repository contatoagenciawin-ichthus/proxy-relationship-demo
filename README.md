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
