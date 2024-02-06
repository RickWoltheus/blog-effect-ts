import { cn } from "@/lib/utils";
import "@/app/globals.css";
import { Urbanist as FontSans } from "next/font/google";
import { AnimatedLogo } from "@/features/home/AnimatedLogo";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex w-full justify-center pt-8">
      <div className=" max-w-[600]">{children}</div>
    </div>
  );
}
