import type { Metadata } from "next";
import { Poppins } from "next/font/google";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/context/AuthProviders";
import { Toaster } from "@/components/ui/sonner"
// import Navbar from "@/components/Navbar";

const poppins = Poppins({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-poppins", // This creates a variable we can use in CSS
});
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: "Mystery Message",
  description: "Anonymous Messaging web app",
  icons: {
    icon: "/favicon.png",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" >
      <AuthProvider>
      <body
className={`${poppins.className} antialiased`}>
        {/* <Navbar/> */}
        {children}
        <Toaster/>
      </body>
      </AuthProvider>
    </html>
  );
}
