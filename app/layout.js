import "./globals.css";

export const metadata = {
  title: "Texfield | Central de Relacionamento",
  description: "Ambiente demonstrativo da plataforma de relacionamento Proxy Technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
