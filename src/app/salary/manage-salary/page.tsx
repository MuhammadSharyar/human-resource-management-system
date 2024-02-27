"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import SectionContainer from "@/components/ui/section-container";
import SectionHeading from "@/components/ui/section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
import { TbCheck, TbEdit, TbTrash } from "react-icons/tb";
import { cn } from "@/lib/utils";
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

type TableDataProps = {
  staffName: string;
  staffEmail: string;
  basicSalary: number;
  allowance: number;
  total: number;
  editable: boolean;
};

export default function AddSalary() {
  const { toast } = useToast();
  const [dptState, setDptState] = useState({
    departments: [],
    selectedDepartment: "",
    loading: true,
  });
  const [editableRow, setEditableRow] = useState<number>(-1);
  const [tableData, setTableData] = useState<TableDataProps[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState<string>("");
  const [salaryData, setSalaryData] = useState({
    basicSalary: 0,
    allowance: 0,
    total: 0,
  });

  const getDepartments = async () => {
    setDptState({ ...dptState, loading: true });
    await fetch("/api/department").then((res) =>
      res.json().then((parsedRes) => {
        setDptState({
          departments: parsedRes.data,
          selectedDepartment: "",
          loading: false,
        });
      })
    );
  };

  const getSalariesByDepartment = async (department: string) => {
    setTableLoading(true);
    await fetch(`/api/salary?department=${department}`).then((res) =>
      res.json().then((parsedRes) => {
        for (let salary of parsedRes.data) {
          salary.editable = false;
        }
        setTableData(parsedRes.data);
      })
    );
    setTableLoading(false);
  };

  const updateSalary = async (data: TableDataProps) => {
    setRowLoading(data.staffEmail);
    if (
      data.basicSalary === undefined ||
      data.allowance === undefined ||
      Object.values(data).some(
        (v) => v === null || (typeof v === "number" && isNaN(v))
      )
    ) {
      toast({
        variant: "destructive",
        description: "Please fill all fields in a row to add salary",
        duration: 1500,
      });
    } else {
      const res = await fetch("/api/salary", {
        method: "PATCH",
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (res.message === "request successful") {
        toast({
          description: "Salary update successfully.",
        });
        getSalariesByDepartment(dptState.selectedDepartment);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong, please try again.",
        });
      }
    }
    setRowLoading("");
  };

  const deleteSalary = async (data: TableDataProps) => {
    console.log(data);
    const res = await fetch(`/api/salary?email=${data.staffEmail}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (res.message === "request successful") {
      toast({
        description: "Salary deleted successfully.",
      });
      getSalariesByDepartment(dptState.selectedDepartment);
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again.",
      });
    }
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <SectionContainer className="px-0 md:px-5">
      <SectionHeading title="Manage Salaries" className="pl-5" />
      <div className="flex flex-col lg:w-[60%] border p-5 border-dashed rounded-lg mb-7">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <h2 className="mb-3">Department</h2>
              {dptState.loading ? (
                <LoadingSkeleton />
              ) : (
                <Input
                  type="text"
                  id="department"
                  placeholder="Select Department"
                  value={dptState.selectedDepartment}
                  className="cursor-pointer"
                />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={dptState.selectedDepartment}
              onValueChange={(value) => {
                setDptState({ ...dptState, selectedDepartment: value });
                getSalariesByDepartment(value);
              }}
            >
              {dptState.departments.map((dpt) => (
                <DropdownMenuRadioItem value={dpt["name"]}>
                  {dpt["name"]}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {dptState.selectedDepartment === "" ? null : (
        <div className="border rounded-lg">
          <Table className="overflow-x-auto whitespace-nowrap">
            <TableHeader>
              <TableRow>
                <TableHead>Staff</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Basic Salary ($)</TableHead>
                <TableHead>Allowance ($)</TableHead>
                <TableHead>Total ($)</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            {tableLoading ? (
              <TableSkeleton />
            ) : (
              <TableBody className="overflow-scroll">
                {tableData.map((row, index) =>
                  rowLoading === row.staffEmail ? (
                    <RowSkeleton />
                  ) : (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {row.staffName}
                      </TableCell>
                      <TableCell className="font-medium">
                        {row.staffEmail}
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled={!row.editable}
                          type="number"
                          className="min-w-40"
                          value={row.basicSalary}
                          onChange={(e) => {
                            row.basicSalary = parseInt(e.target.value);
                            row.total =
                              (row.basicSalary ?? 0) + (row.allowance ?? 0);
                            setSalaryData({
                              basicSalary: row.basicSalary,
                              allowance: row.allowance ?? 0,
                              total: row.total,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled={!row.editable}
                          type="number"
                          className="min-w-40"
                          value={row.allowance}
                          onChange={async (e) => {
                            row.allowance = parseInt(e.target.value);
                            row.total =
                              (row.basicSalary ?? 0) + (row.allowance ?? 0);
                            setSalaryData({
                              basicSalary: row.basicSalary ?? 0,
                              allowance: row.allowance,
                              total: row.total,
                            });
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          disabled={!row.editable}
                          type="number"
                          className="min-w-40"
                          value={row.total}
                        />
                      </TableCell>
                      <TableCell>
                        {row.editable ? (
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              "active:scale-95 active:bg-blue-600 active:text-primary-foreground"
                            )}
                            onClick={() => {
                              if (rowLoading !== row.staffEmail) {
                                updateSalary(row);
                                row.editable = false;
                                setEditableRow(-1);
                              }
                            }}
                          >
                            <TbCheck />
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="icon"
                            className={cn(
                              "active:scale-95 active:bg-primary active:text-primary-foreground"
                            )}
                            onClick={() => {
                              row.editable = true;
                              setEditableRow(index);
                            }}
                          >
                            <TbEdit />
                          </Button>
                        )}

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
                                {`Are you sure you want to delete "${row.staffName}"'s salary?`}
                              </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                              <DialogClose>
                                <Button
                                  type="submit"
                                  variant="destructive"
                                  onClick={() => deleteSalary(row)}
                                >
                                  Confirm
                                </Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            )}
          </Table>
        </div>
      )}
    </SectionContainer>
  );
}

function RowSkeleton() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
      <TableCell>
        <Skeleton className="h-8" />
      </TableCell>
    </TableRow>
  );
}

function TableSkeleton() {
  return (
    <TableBody className="overflow-scroll">
      {[1, 2].map(() => (
        <TableRow>
          <TableCell className="font-medium">
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8" />
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
}

function LoadingSkeleton() {
  return <Skeleton className="h-7" />;
}
