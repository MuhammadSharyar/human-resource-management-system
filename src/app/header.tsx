"use client";

import { ThemeSwitcher } from "@/components/theme-switcher";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarContext } from "@/contexts/sidebar-context";
import { cn } from "@/lib/utils";
import { useContext } from "react";
import { BiMenuAltLeft } from "react-icons/bi";
import { Righteous } from "next/font/google";
import { BsStars } from "react-icons/bs";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

export default function Header() {
  const { sidebar, setSidebar } = useContext(SidebarContext)!;
  return (
    <div className="sticky top-0 z-40 flex justify-between md:justify-end items-center w-full px-4 border-b h-12 bg-background">
      <BiMenuAltLeft
        className="text-2xl md:hidden"
        onClick={() => setSidebar(!sidebar)}
      />
      <div className="flex gap-x-2 items-center md:hidden">
        <BsStars className="bg-blue-600 text-white w-7 h-7 p-1.5 rounded-sm" />
        <h2 className={cn(righteous.className, "text-lg")}>HRMS</h2>
      </div>
      <div className="flex gap-x-2 items-center">
        <ThemeSwitcher />
        <Avatar className="w-8 h-8">
          <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
