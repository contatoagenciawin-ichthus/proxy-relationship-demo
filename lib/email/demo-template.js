function escapeHtml(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function buildTexfieldDemoEmail() {
  const ctaUrl =
    process.env.TEXFIELD_DEMO_CTA_URL?.trim() ||
    "https://texfield.com.br";

  const subject =
    "Texfield | Tecnologia e soluções para a indústria têxtil";

  const previewText =
    "Máquinas, peças, tecnologia e atendimento especializado para a indústria têxtil.";

  const safeCta = escapeHtml(ctaUrl);

  const htmlContent = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(subject)}</title>
  </head>
  <body style="margin:0;padding:0;background:#eef2f5;color:#17212b;font-family:Arial,Helvetica,sans-serif;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">
      ${escapeHtml(previewText)}
    </div>

    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="width:100%;background:#eef2f5;">
      <tr>
        <td align="center" style="padding:32px 12px;">
          <table role="presentation" width="640" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:640px;background:#ffffff;border-collapse:collapse;">
            <tr>
              <td style="height:6px;background:#173f5f;font-size:0;line-height:0;">&nbsp;</td>
            </tr>

            <tr>
              <td style="padding:34px 34px 16px;">
                <p style="margin:0;color:#173f5f;font-size:13px;line-height:18px;font-weight:800;letter-spacing:2px;">
                  TEXFIELD
                </p>
                <p style="margin:8px 0 0;color:#7a8792;font-size:12px;line-height:18px;">
                  Soluções para a indústria têxtil
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:20px 34px 4px;">
                <p style="margin:0 0 10px;color:#4d708c;font-size:11px;line-height:18px;font-weight:700;letter-spacing:1.4px;text-transform:uppercase;">
                  Relacionamento comercial
                </p>
                <h1 style="margin:0;color:#17212b;font-size:32px;line-height:39px;font-weight:700;letter-spacing:-0.6px;">
                  Tecnologia, peças e atendimento para manter sua produção em movimento.
                </h1>
                <p style="margin:22px 0 0;color:#5f6d78;font-size:16px;line-height:27px;">
                  A Texfield conecta a indústria têxtil a máquinas, componentes, assistência e novas tecnologias. Este e-mail demonstra como novidades comerciais e técnicas podem chegar a públicos segmentados com acompanhamento de resultados.
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:28px 34px 36px;">
                <table role="presentation" cellspacing="0" cellpadding="0" border="0">
                  <tr>
                    <td style="border-radius:4px;background:#173f5f;">
                      <a
                        href="${safeCta}"
                        style="display:inline-block;padding:14px 22px;color:#ffffff;font-size:14px;line-height:20px;font-weight:700;text-decoration:none;"
                      >
                        Conhecer soluções Texfield
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <tr>
              <td style="padding:24px 34px;background:#122331;">
                <p style="margin:0;color:#cbd5dd;font-size:12px;line-height:20px;">
                  Mensagem de demonstração da Central de Relacionamento Texfield.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const textContent = `Texfield

Tecnologia, peças e atendimento para manter sua produção em movimento.

A Texfield conecta a indústria têxtil a máquinas, componentes, assistência e novas tecnologias.

Conheça: ${ctaUrl}

Mensagem de demonstração da Central de Relacionamento Texfield.`;

  return {
    subject,
    previewText,
    htmlContent,
    textContent,
  };
}
