import "./globals.css";

export const metadata = {
  title: "Proxy Relationship Intelligence | Demo",
  description:
    "Ambiente demonstrativo da plataforma de relacionamento, comunicação e inteligência comercial da Proxy Technology.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
