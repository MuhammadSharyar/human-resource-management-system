"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SectionContainer from "@/components/ui/section-container";
import SectionHeading from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PiTreeStructureLight,
  PiUsersThreeLight,
  PiFolderNotchMinusLight,
  PiCreditCardLight,
} from "react-icons/pi";

const cardData = [
  {
    id: 1,
    icon: <PiTreeStructureLight className="text-5xl text-blue-600" />,
    title: "Departments",
    total: <span></span>,
    path: "/department/manage-department",
  },
  {
    id: 2,
    icon: <PiUsersThreeLight className="text-5xl text-pink-600" />,
    title: "Staff",
    total: <span></span>,
    path: "/staff/manage-staff",
  },
  {
    id: 3,
    icon: <PiFolderNotchMinusLight className="text-5xl text-orange-600" />,
    title: "Leaves",
    total: <span></span>,
    path: "/leave/manage-staff-leave",
  },
  {
    id: 4,
    icon: <PiCreditCardLight className="text-5xl text-green-600" />,
    title: "Salaries",
    total: <span></span>,
    path: "/salary/manage-salary",
  },
];

export default function Dashboard() {
  const [contentLoading, setContentLoading] = useState(true);

  const getCounts = async () => {
    setContentLoading(true);
    await fetch("/api/dashboard?get-counts=true").then((res) =>
      res.json().then((parsedRes) => {
        const data = parsedRes.data;
        cardData[0].total = (
          <span className="text-blue-600">{data.dptCount}</span>
        );
        cardData[1].total = (
          <span className="text-pink-600">{data.staffCount}</span>
        );
        cardData[2].total = (
          <span className="text-orange-600">{data.leaveCount}</span>
        );
        cardData[3].total = (
          <span className="text-green-600">$ {data.salaryCount}</span>
        );
      })
    );
    setContentLoading(false);
  };

  useEffect(() => {
    getCounts();
  }, []);

  return (
    <SectionContainer>
      <SectionHeading title="Dashboard" />
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-2">
        {cardData.map((card) => {
          return (
            <Link href={card.path}>
              <Card
                key={card.id}
                className="cursor-pointer active:scale-[98%] duration-75"
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
                        <h2 className="text-2xl">
                          {contentLoading ? <LoadingSkeleton /> : card.total}
                        </h2>
                        <p>{card.title}</p>
                      </CardTitle>
                      <CardDescription>View Details</CardDescription>
                    </div>
                    {card.icon}
                  </div>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>
    </SectionContainer>
  );
}

function LoadingSkeleton() {
  return <Skeleton className="flex h-7" />;
}
