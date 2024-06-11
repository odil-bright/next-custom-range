import "@/assets/App.scss";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <p>Prueba técnica - Odil Bright</p>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
