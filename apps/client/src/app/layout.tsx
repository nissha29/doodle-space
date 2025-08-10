import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const ebGaramond = EB_Garamond({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Doodle Space | Collaborative Whiteboard",
  description: "Unleash your creativity with Doodle Space, an online canvas for sketching, drawing, and bringing your ideas to life.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${ebGaramond.className} antialiased`}>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 5000,
            style: {
              border: "1px solid #737373",
              background: "#ffffff",
              color: "#000000",
            },
          }}
        />
        {children}
      </body>
    </html>
  );
}
