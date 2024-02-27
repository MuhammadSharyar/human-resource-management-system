"use client";

import SectionContainer from "@/components/ui/section-container";
import SectionHeading from "@/components/ui/section-heading";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TbCheck, TbEdit, TbTrash, TbX } from "react-icons/tb";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

type LeaveDataProps = {
  staffEmail: string;
  staffName: string;
  photo: string;
  department: string;
  reason: string;
  from: string;
  to: string;
  status: string;
  description: string;
  appliedOn: string;
  editable: boolean;
};

export default function ManageStaffLeave() {
  const { toast } = useToast();
  const [leaveData, setLeaveData] = useState<LeaveDataProps[]>([]);
  const [loadingRow, setLoadingRow] = useState<string>("");
  const [contentLoading, setContentLoading] = useState(true);

  const getLeaves = async () => {
    setContentLoading(true);
    await fetch("/api/leave?status=pending").then((res) =>
      res.json().then((parsedRes) => {
        for (let leave of parsedRes.data) {
          leave.editable = true;
        }
        setLeaveData(parsedRes.data!);
      })
    );
    setContentLoading(false);
  };

  const updateLeave = async ({
    email,
    status,
  }: {
    email: string;
    status: string;
  }) => {
    setLoadingRow(email);
    await fetch(`/api/leave?email=${email}&status=${status}`, {
      method: "PATCH",
    }).then((res) =>
      res.json().then((parsedRes) => {
        if (parsedRes.message === "request successful") {
          toast({
            variant: "default",
            description: "Staff updated successfully",
          });
          getLeaves();
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong, please try again later",
          });
        }
      })
    );
    setLoadingRow("");
  };

  useEffect(() => {
    getLeaves();
  }, []);

  return (
    <SectionContainer className="px-0 md:px-5">
      <SectionHeading title="Manage Leaves" className="pl-5" />
      <div className="border rounded-lg">
        <Table className="overflow-x-auto whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Sr #</TableHead>
              <TableHead>Staff</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Reason</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Applied On</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {contentLoading === true ? (
            <TableSkeleton />
          ) : (
            <TableBody className="overflow-scroll">
              {leaveData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-fit">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      row.staffName
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      <Image
                        src={row.photo}
                        height={50}
                        width={50}
                        objectFit={"contain"}
                        alt=""
                        className="border rounded-md"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      row.department
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      row.reason
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? <RowSkeleton /> : row.from}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? <RowSkeleton /> : row.to}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      <div
                        className={cn(
                          "rounded-sm text-center p-0.5 text-xs capitalize bg-yellow-600",
                          row.status === "approved"
                            ? "bg-green-600"
                            : row.status === "rejected"
                            ? "bg-red-600"
                            : ""
                        )}
                      >
                        {row.status}
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      row.description ?? "Empty"
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.staffEmail ? (
                      <RowSkeleton />
                    ) : (
                      row.appliedOn
                    )}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      className="active:scale-95 hover:bg-green-600 active:bg-primary active:text-primary-foreground"
                      onClick={() => {
                        updateLeave({
                          email: row.staffEmail,
                          status: "approved",
                        });
                      }}
                    >
                      <TbCheck />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="ml-1 active:scale-95 hover:bg-red-600 active:bg-primary active:text-primary-foreground"
                      onClick={() => {
                        updateLeave({
                          email: row.staffEmail,
                          status: "rejected",
                        });
                      }}
                    >
                      <TbX />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </div>
    </SectionContainer>
  );
}

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
      <TableCell>
        <Skeleton className="flex h-7" />
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <TableBody>
      {[1, 2].map(() => (
        <RowSkeleton />
      ))}
    </TableBody>
  );
}
