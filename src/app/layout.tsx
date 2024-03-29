import type { Metadata } from "next";
import { Inter, Montserrat, Poppins } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Sidebar from "./sidebar";
import Header from "./header";
import SidebarContextProvider from "@/contexts/sidebar-context";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <SidebarContextProvider>
            <div className="flex">
              <Sidebar />
              <div className="w-full">
                <Header />
                {children}
              </div>
            </div>
            <Toaster />
            {/* <div
              className={cn(
                "absolute w-screen h-screen bg-background z-40",
                !sidebar ? "hidden" : "opacity-75"
              )}
              onClick={() => setSidebar(false)}
            /> */}
          </SidebarContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
