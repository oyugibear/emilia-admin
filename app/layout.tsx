import type { Metadata } from "next";
import "./globals.css";
import { Montserrat, } from "next/font/google";
import SideMenu from "../components/navigation/SideMenu";
import Providers from "./providers";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Emilia Admin Dashboard",
  description: "Admin dashboard for Emilia Residences",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={montserrat.className} suppressHydrationWarning>
        <Providers>
          <div className="flex min-h-screen">
            {/* Sidebar - shows on large screens, hidden on mobile */}
            <SideMenu />
            
            {/* Main content area */}
            <div className="flex-1 flex flex-col">
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
