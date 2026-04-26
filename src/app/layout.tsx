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
        <meta name="monetag" content="233866" />
        <script src="https://quge5.com/88/tag.min.js" data-zone="233866" async data-cfasync="false"></script>
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10930026',s.src='https://al5sm.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }}></script>
        <script dangerouslySetInnerHTML={{ __html: `(function(s){s.dataset.zone='10930028',s.src='https://n6wxm.com/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))` }}></script>
      </head>
      <body>
        <nav className="navbar">
          <a href="/" className="logo">
            Nexus<span>Web</span>
          </a>
          <SearchBar />
          <div className="nav-links">
            <a href="/" className="btn">Inicio</a>
            <a href="/movies" className="btn btn-outline-primary">Películas</a>
            <a href="/series" className="btn btn-outline-secondary">Series</a>
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
