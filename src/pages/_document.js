import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta name="description" content="Pixisphere - Find the perfect photographer for your special moments" />
        <meta name="keywords" content="photographer, photography, wedding, maternity, newborn, birthday, portrait" />
        <meta name="author" content="Pixisphere" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Preload fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}