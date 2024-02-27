"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TbEdit, TbTrash } from "react-icons/tb";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeading from "@/components/ui/section-heading";
import SectionContainer from "@/components/ui/section-container";

type DepartmentObject = {
  id: number;
  name: string;
  createdAt: any;
};

type DepartmentProps = {
  id: number;
  name: string;
};

export default function ManageDepartment() {
  const [tableData, setTableData] = useState<DepartmentObject[]>([]);
  const [loadingRow, setLoadingRow] = useState(0);
  const dptName = useRef(null);
  const { toast } = useToast();

  const getDepartments = async () => {
    await fetch("/api/department").then((res) =>
      res.json().then((parsedRes) => setTableData(parsedRes.data))
    );
  };

  const updateDepartment = async ({ id, name }: DepartmentProps) => {
    setLoadingRow(id);
    await fetch(`/api/department?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    }).then((res) => {
      res.json().then((parsedRes) => {
        if (parsedRes.message === "request successful") {
          toast({
            variant: "default",
            description: "Department updated successfully",
          });
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong, please try again later",
          });
        }
      });
      setLoadingRow(0);
      getDepartments();
    });
  };

  const deleteDepartment = async (id: number) => {
    setLoadingRow(id);
    const res = await fetch(`/api/department?id=${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (res.message === "request successful") {
      toast({
        variant: "default",
        description: "Department deleted successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again later",
      });
    }
    setLoadingRow(0);
    getDepartments();
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <SectionContainer className="px-0 md:px-5">
      <SectionHeading title="Manage Departments" className="pl-5" />
      <div className="border rounded-lg mb-5">
        <Table className="overflow-x-auto whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Sr #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          {tableData.length === 0 ? (
            <TableSkeleton />
          ) : (
            <TableBody className="overflow-scroll">
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.name}
                  </TableCell>
                  <TableCell className="text-right">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="active:scale-95 active:bg-primary active:text-primary-foreground"
                        >
                          <TbEdit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Edit department</DialogTitle>
                          <DialogDescription>
                            Make changes to the department here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="name" className="text-right">
                            Name
                          </Label>
                          <Input
                            id="name"
                            ref={dptName}
                            placeholder="Department Name"
                            className="col-span-3"
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              type="submit"
                              onClick={() =>
                                updateDepartment({
                                  id: row.id,
                                  name: dptName.current!["value"],
                                })
                              }
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="ml-1 active:scale-95 active:bg-destructive active:text-destructive-foreground"
                        >
                          <TbTrash />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                          <DialogTitle>Warning!!</DialogTitle>
                          <DialogDescription>
                            {`Are you sure you want to delete "${row.name}" department?`}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              type="submit"
                              variant="destructive"
                              onClick={() => deleteDepartment(row.id)}
                            >
                              Confirm
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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

function TableSkeleton() {
  return (
    <TableBody>
      {[1, 2].map(() => (
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
        </TableRow>
      ))}
    </TableBody>
  );
}

function RowSkeleton() {
  return <Skeleton className="h-7" />;
}
