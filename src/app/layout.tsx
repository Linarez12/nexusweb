import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import SearchBar from "./components/SearchBar";

export const metadata: Metadata = {
  title: "Nexus Web - Películas y Series Gratis",
  description: "Disfruta de las mejores películas y series en la mejor calidad, de manera completamente gratuita.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* ============================================================== */}
        {/* 🤑 AQUI VA TU ETIQUETA <meta> Y SCRIPTS DE MONETAG 🤑          */}
        {/* Ejemplo: <meta name="monetag" content="123456789" />          */}
        {/* ============================================================== */}
      </head>
      <body>
        <nav className="navbar">
          <a href="/" className="logo">
            Nexus<span>Web</span>
          </a>
          <SearchBar />
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="/" className="btn">Inicio</a>
            <a href="/movies" className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>Películas</a>
            <a href="/series" className="btn" style={{ background: 'transparent', border: '1px solid var(--accent-secondary)', color: 'var(--accent-secondary)' }}>Series</a>
          </div>
        </nav>
        
        {children}

        {/* ============================================================== */}
        {/* 🤑 AQUI ABAJO PUEDES PONER EL SCRIPT POPUNDER DE MONETAG 🤑   */}
        {/* usar la etiqueta <Script> de Next.js es la mejor forma.        */}
        {/* ============================================================== */}
        {/* <Script src="https://alwingulla.com/88/tag.min.js" data-zone="12345" strategy="afterInteractive" /> */}
      </body>
    </html>
  );
}
