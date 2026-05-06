import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";



export const metadata: Metadata = {
  title: "DevÜcretsiz — Yazılımcılar için Ücretsiz Kaynaklar",
  description:
    "AI API'leri, hosting, veritabanı, storage ve daha fazlası. Yazılım geliştirici için tüm ücretsiz kaynaklar tek bir yerde.",
    verification: {
  google: "I6vM8-zb7pze9-hSlKmWkqcDlq2iQUOIOvH27RAYVX8" ,
},
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="tr" className="h-full antialiased">
        <body className="min-h-full">{children}</body>
      </html>
    </ClerkProvider>
  );
}
