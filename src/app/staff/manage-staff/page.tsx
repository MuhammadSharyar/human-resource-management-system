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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import SectionHeading from "@/components/ui/section-heading";
import SectionContainer from "@/components/ui/section-container";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type StaffProps = {
  id: string;
  name: string;
  department: string;
  gender: string;
  email: string;
  phone: string;
  photo: string;
  dateOfBirth: string;
  dateOfJoining: string;
  city: string;
  state: string;
  country: string;
  address: string;
};

export default function ManageStaff() {
  const [contentLoading, setContentLoading] = useState(true);
  const [tableData, setTableData] = useState<StaffProps[]>([]);
  const [loadingRow, setLoadingRow] = useState("");
  const [staffData, setStaffData] = useState({
    name: "",
    department: "",
    gender: "",
    email: "",
    phone: "",
    photo: "",
    dateOfBirth: "",
    dateOfJoining: "",
    city: "",
    state: "",
    country: "",
    address: "",
  });
  const [dptState, setDptState] = useState({
    dptList: [],
    loading: true,
  });
  const { toast } = useToast();

  const getStaff = async () => {
    await fetch("/api/staff").then((res) =>
      res.json().then((parsedRes) => setTableData(parsedRes.data))
    );
  };

  const getDepartments = async () => {
    await fetch("/api/department").then((res) =>
      res.json().then((parsedRes) => {
        setDptState({
          dptList: parsedRes.data,
          loading: false,
        });
        setStaffData({ ...staffData, department: parsedRes.data[0].name });
      })
    );
  };

  const updateStaff = async ({
    id,
    name,
    department,
    gender,
    email,
    phone,
    photo,
    dateOfBirth,
    dateOfJoining,
    city,
    state,
    country,
    address,
  }: StaffProps) => {
    setLoadingRow(id);
    await fetch(`/api/staff?id=${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        name,
        department,
        gender,
        email,
        phone,
        photo,
        dateOfBirth,
        dateOfJoining,
        city,
        state,
        country,
        address,
      }),
    }).then((res) => {
      res.json().then((parsedRes) => {
        if (parsedRes.message === "request successful") {
          toast({
            variant: "default",
            description: "Staff updated successfully",
          });
        } else {
          toast({
            variant: "destructive",
            description: "Something went wrong, please try again later",
          });
        }
      });
      setLoadingRow("");
      getStaff();
    });
  };

  const handleImageUpdate = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setStaffData({ ...staffData, photo: reader.result!.toString() });
    };
  };

  const deleteStaff = async (id: string) => {
    setLoadingRow(id);
    const res = await fetch(`/api/staff?id=${id}`, {
      method: "DELETE",
    }).then((res) => res.json());
    if (res.message === "request successful") {
      toast({
        variant: "default",
        description: "Staff deleted successfully",
      });
    } else {
      toast({
        variant: "destructive",
        description: "Something went wrong, please try again later",
      });
    }
    setLoadingRow("");
    getStaff();
  };

  useEffect(() => {
    getStaff();
    getDepartments();
    setContentLoading(false);
  }, []);

  return (
    <SectionContainer className="px-0 md:px-5">
      <SectionHeading title="Manage Staff" className="pl-5" />
      <div className="border rounded-lg">
        <Table className="overflow-x-auto whitespace-nowrap">
          <TableHeader>
            <TableRow>
              <TableHead>Sr #</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Photo</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Gender</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>DOB</TableHead>
              <TableHead>Date of Joining</TableHead>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Country</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          {contentLoading === true ? (
            <TableSkeleton />
          ) : (
            <TableBody className="overflow-scroll">
              {tableData.map((row, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium w-fit">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.name}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? (
                      <RowSkeleton />
                    ) : (
                      <Image
                        src={row.photo}
                        height={50}
                        width={50}
                        objectFit={"contain"}
                        alt=""
                        className="border rounded-sm"
                      />
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.department}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.gender}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.email}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.phone}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? (
                      <RowSkeleton />
                    ) : (
                      row.dateOfBirth.toString()
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? (
                      <RowSkeleton />
                    ) : (
                      row.dateOfJoining.toString()
                    )}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.city}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.state}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.country}
                  </TableCell>
                  <TableCell>
                    {loadingRow === row.id ? <RowSkeleton /> : row.address}
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="active:scale-95 active:bg-primary active:text-primary-foreground"
                          onClick={() =>
                            setStaffData({
                              ...row,
                              dateOfBirth: row.dateOfBirth.toString(),
                              dateOfJoining: row.dateOfJoining.toString(),
                            })
                          }
                        >
                          <TbEdit />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] h-[50%] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Edit Staff</DialogTitle>
                          <DialogDescription>
                            Make changes to the staff here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            placeholder="Staff Name"
                            className="col-span-3"
                            value={staffData.name}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="photo">Photo</Label>
                          <Input
                            id="photo"
                            type="file"
                            onChange={handleImageUpdate}
                          />
                          <Image
                            src={staffData.photo}
                            alt=""
                            height={40}
                            width={40}
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="department">Department</Label>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <div>
                                {dptState.loading ? (
                                  <RowSkeleton />
                                ) : (
                                  <Input
                                    type="text"
                                    id="department"
                                    placeholder="Department"
                                    value={staffData.department}
                                  />
                                )}
                              </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56">
                              <DropdownMenuRadioGroup
                                value={staffData.department}
                                onValueChange={(value) =>
                                  setStaffData({
                                    ...staffData,
                                    department: value,
                                  })
                                }
                              >
                                {dptState.dptList.map((dpt) => (
                                  <DropdownMenuRadioItem value={dpt["name"]}>
                                    {dpt["name"]}
                                  </DropdownMenuRadioItem>
                                ))}
                              </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="gender">Gender</Label>
                          <Input
                            id="gender"
                            placeholder="Staff Gender"
                            className="col-span-3"
                            value={staffData.gender}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                gender: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            placeholder="Staff Email"
                            className="col-span-3"
                            value={staffData.email}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                email: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            placeholder="Staff Phone"
                            className="col-span-3"
                            value={staffData.phone}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                phone: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="dob">DOB</Label>
                          <Input
                            type="date"
                            id="dob"
                            value={staffData.dateOfBirth}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                dateOfBirth: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center">
                          <Label htmlFor="doj">Date of Joining</Label>
                          <Input
                            type="date"
                            id="doj"
                            value={staffData.dateOfJoining}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                dateOfJoining: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            placeholder="Staff City"
                            className="col-span-3"
                            value={staffData.city}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                city: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="state">State</Label>
                          <Input
                            id="state"
                            placeholder="Staff State"
                            className="col-span-3"
                            value={staffData.state}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                state: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="country">Country</Label>
                          <Input
                            id="country"
                            placeholder="Staff Country"
                            className="col-span-3"
                            value={staffData.country}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                country: e.target.value,
                              })
                            }
                          />
                        </div>
                        <div className="flex items-center gap-x-4">
                          <Label htmlFor="address">Address</Label>
                          <Input
                            id="address"
                            placeholder="Staff Address"
                            className="col-span-3"
                            value={staffData.address}
                            onChange={(e) =>
                              setStaffData({
                                ...staffData,
                                address: e.target.value,
                              })
                            }
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose>
                            <Button
                              type="submit"
                              onClick={() =>
                                loadingRow === ""
                                  ? updateStaff({
                                      id: row.id,
                                      ...staffData,
                                    })
                                  : null
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
                              onClick={() => deleteStaff(row.id)}
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
  return [1, 2].map(() => (
    <TableBody className="overflow-scroll">
      <TableRow>
        <TableCell className="font-medium w-fit">
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
    </TableBody>
  ));
}

function RowSkeleton() {
  return <Skeleton className="h-8" />;
}
