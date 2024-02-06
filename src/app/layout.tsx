import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Urbanist as FontSans } from "next/font/google";
import { AnimatedLogo } from "@/features/home/AnimatedLogo";
import Link from "next/link";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable,
        )}
      >
        <nav className="w-full flex justify-center items-center pt-2 pb-2 fixed bg-white top-0 z-20">
          <div className="max-w-screen-lg w-full ">
            <Link href="/">
              <AnimatedLogo />
            </Link>
          </div>
        </nav>
        <div className="h-20"></div>
        {/* <div className=" h-96 w-full overflow-hidden mb-6">
          <div className="isolate">
            <div className="noise"></div>
            <div className="overlay flex justify-center">
              <div className="max-w-screen-lg w-full">
                <p className="font-extrabold text-5xl absolute pt-16">
                  My blog
                </p>
              </div>
            </div>
          </div>
        </div> */}
        {children}
      </body>
    </html>
  );
}
