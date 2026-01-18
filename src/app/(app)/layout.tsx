import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Geist, Geist_Mono } from "next/font/google";
// import "../globals.css";
import AuthProvider from "@/context/AuthProviders";
import { Toaster } from "@/components/ui/sonner"
import Navbar from "@/components/Navbar";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

const poppins = Poppins({
  weight: ["400", "500", "600", "700"], // Poppins needs weights specified
  subsets: ["latin"],
  display: "swap",
});
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
    <html lang="en">
      <body
        className={poppins.className}
      >
        <Navbar/>
        {children}
      </body>
    </html>
  );
}
