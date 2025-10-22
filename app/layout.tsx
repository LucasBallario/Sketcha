import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";


const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
});



export const metadata: Metadata = {
  title: "Sketcha",
  description: "From sketch to render",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={inter.className}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
