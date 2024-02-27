"use client";

import { useContext } from "react";
import {
  PiXLight,
  PiSquaresFourLight,
  PiSquaresFourFill,
  PiTreeStructureLight,
  PiTreeStructureFill,
  PiUsersThreeLight,
  PiUsersThreeFill,
  PiFolderNotchMinusLight,
  PiFolderNotchMinusFill,
  PiCreditCardLight,
  PiCreditCardFill,
  PiFilesLight,
  PiFilesFill,
  PiGearSixLight,
  PiGearSixFill,
} from "react-icons/pi";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

import { BsStars } from "react-icons/bs";
import { cn } from "@/lib/utils";
import { Righteous } from "next/font/google";
import { SidebarContext } from "@/contexts/sidebar-context";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import Link from "next/link";

const righteous = Righteous({ subsets: ["latin"], weight: ["400"] });

export default function Sidebar() {
  const { sidebar, setSidebar } = useContext(SidebarContext)!;
  const path = usePathname();

  const MenuItems = [
    {
      title: "Dashboard",
      selectedIcon: <PiSquaresFourFill className="text-primary" />,
      unSelectedIcon: <PiSquaresFourLight className="text-primary" />,
      pathName: "/dashboard",
    },
    {
      title: "Department",
      selectedIcon: <PiTreeStructureFill className="text-primary" />,
      unSelectedIcon: <PiTreeStructureLight className="text-primary" />,
      subMenus: [
        {
          title: "Add Department",
          pathName: "/department/add-department",
        },
        {
          title: "Manage Department",
          pathName: "/department/manage-department",
        },
      ],
    },
    {
      title: "Staff",
      selectedIcon: <PiUsersThreeFill className="text-primary" />,
      unSelectedIcon: <PiUsersThreeLight className="text-primary" />,
      subMenus: [
        {
          title: "Add Staff",
          pathName: "/staff/add-staff",
        },
        {
          title: "Manage Staff",
          pathName: "/staff/manage-staff",
        },
      ],
    },
    {
      title: "Leave",
      selectedIcon: <PiFolderNotchMinusFill className="text-primary" />,
      unSelectedIcon: <PiFolderNotchMinusLight className="text-primary" />,
      subMenus: [
        {
          title: "Manage Staff's Leave",
          pathName: "/leave/manage-staff-leave",
        },
        {
          title: "Leave History",
          pathName: "/leave/leave-history",
        },
      ],
    },
    {
      title: "Salary",
      selectedIcon: <PiCreditCardFill className="text-primary" />,
      unSelectedIcon: <PiCreditCardLight className="text-primary" />,
      subMenus: [
        {
          title: "Add Salary",
          pathName: "/salary/add-salary",
        },
        {
          title: "Manage Salary",
          pathName: "/salary/manage-salary",
        },
      ],
    },

    {
      title: "Files",
      selectedIcon: <PiFilesFill className="text-primary" />,
      unSelectedIcon: <PiFilesLight className="text-primary" />,
      gap: true,
      pathName: "/files",
    },
    {
      title: "Settings",
      selectedIcon: <PiGearSixFill className="text-primary" />,
      unSelectedIcon: <PiGearSixLight className="text-primary" />,
      pathName: "/settings",
    },
  ];

  return (
    <div
      className={cn(
        "flex flex-col items-start absolute md:fixed border-r h-screen px-5 bg-background w-[80%] md:w-[20%] z-50 duration-75",
        sidebar ? "translate-x-0" : "-translate-x-[100%] md:translate-x-0"
      )}
    >
      <div className="flex justify-between items-center w-full">
        <div className="flex gap-x-4 items-center py-9">
          <BsStars className="bg-blue-600 text-white w-9 h-9 p-1.5 rounded-sm" />
          <h2 className={cn(righteous.className, "text-lg")}>HRMS</h2>
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setSidebar(false)}
          className="md:hidden"
        >
          <PiXLight className="h-4 w-4" />
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full">
        {MenuItems.map((item, index) =>
          !item.subMenus ? (
            <Link
              href={item.pathName}
              className={cn(
                "flex items-center gap-x-4 py-1 px-2 rounded-sm hover:bg-secondary cursor-pointer active:scale-95 duration-75",
                path === item.pathName ? "bg-secondary" : null,
                item.gap ? "mt-10" : "mt-2"
              )}
              onClick={() => {
                setSidebar(false);
              }}
            >
              {path === item.pathName ? item.selectedIcon : item.unSelectedIcon}
              <h4 className={cn("text-sm")}>{item.title}</h4>
            </Link>
          ) : (
            <AccordionItem value={`item-${index}`}>
              <AccordionTrigger>
                <div
                  className={cn(
                    "flex items-center gap-x-4 py-1 px-2",
                    path === item.pathName ? "bg-secondary" : null,
                    item.gap ? "mt-10" : "mt-2"
                  )}
                >
                  <h4 className={cn("text-sm")}>{item.title}</h4>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                {item.subMenus?.map((item) => {
                  return (
                    <Link
                      href={item.pathName}
                      className={cn(
                        "flex items-center gap-x-4 py-1 px-2 rounded-sm hover:bg-secondary cursor-pointer active:scale-95 duration-75 mt-2",
                        path === item.pathName ? "bg-secondary" : null
                      )}
                      onClick={() => {
                        setSidebar(false);
                      }}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </AccordionContent>
            </AccordionItem>
          )
        )}
      </Accordion>
    </div>
  );
}
