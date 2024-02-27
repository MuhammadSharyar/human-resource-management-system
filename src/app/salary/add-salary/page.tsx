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

type TableDataProps = {
  id: string;
  name: string;
  email: string;
  basicSalary: number;
  allowance: number;
  total: number;
};

export default function AddSalary() {
  const { toast } = useToast();
  const [dptState, setDptState] = useState({
    departments: [],
    selectedDepartment: "",
    loading: true,
  });
  const [tableData, setTableData] = useState<TableDataProps[]>([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [rowLoading, setRowLoading] = useState("");
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

  const getStaffByDepartment = async (department: string) => {
    setTableLoading(true);
    await fetch(`/api/staff?department=${department}&salary=false`).then(
      (res) => res.json().then((parsedRes) => setTableData(parsedRes.data))
    );
    setTableLoading(false);
  };

  const addSalary = async (data: TableDataProps) => {
    setRowLoading(data.email);
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
        method: "POST",
        body: JSON.stringify(data),
      }).then((res) => res.json());
      if (res.message === "request successful") {
        toast({
          description: "Salary added successfully!.",
        });
        getStaffByDepartment(dptState.selectedDepartment);
      } else {
        toast({
          variant: "destructive",
          description: "Something went wrong, please try again.",
        });
      }
    }
    setRowLoading("");
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <SectionContainer className="px-0 md:px-5">
      <SectionHeading title="Add Salary" className="pl-5" />
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
                getStaffByDepartment(value);
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
                  rowLoading === row.email ? (
                    <RowSkeleton />
                  ) : (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{row.name}</TableCell>
                      <TableCell className="font-medium">{row.email}</TableCell>
                      <TableCell>
                        <Input
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
                          type="number"
                          className="min-w-40"
                          value={row.total}
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          size={"sm"}
                          className="w-fit active:scale-95 duration-75"
                          onClick={() => {
                            !rowLoading ? addSalary(row) : null;
                          }}
                        >
                          Submit
                        </Button>
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
