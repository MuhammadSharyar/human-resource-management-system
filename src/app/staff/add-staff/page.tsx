"use client";

import SectionHeading from "@/components/ui/section-heading";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import SectionContainer from "@/components/ui/section-container";
import Spinner from "@/components/ui/spinner";

export default function AddStaff() {
  const [loading, setLoading] = useState(false);
  const [dptState, setDptState] = useState({
    dptList: [],
    loading: true,
  });
  const { toast } = useToast();
  const [formData, setFormData] = useState({
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

  const addStaff = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const someFieldIsEmpty = Object.values(formData).some(
        (v) => v === "" || v === null
      );
      if (someFieldIsEmpty) {
        toast({
          variant: "destructive",
          description: "Please fill all fields",
          duration: 1000,
        });
      } else {
        await fetch("/api/staff", {
          method: "POST",
          body: JSON.stringify(formData),
        }).then((res) =>
          res.json().then((parsedRes) => {
            if (parsedRes.message === "request successful") {
              toast({
                description: "Staff added successfully",
              });
            } else {
              toast({
                variant: "destructive",
                description: "Something went wrong, please try again.",
              });
            }
          })
        );
      }
      setLoading(false);
      setFormData({
        ...formData,
        name: "",
        photo: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        address: "",
      });
    }
  };

  const getDepartments = async () => {
    await fetch("/api/department").then((res) =>
      res.json().then((parsedRes) => {
        setDptState({
          dptList: parsedRes.data,
          loading: false,
        });
        setFormData({ ...formData, department: parsedRes.data[0].name });
      })
    );
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      setFormData({ ...formData, photo: reader.result!.toString() });
    };
  };

  useEffect(() => {
    getDepartments();
  }, []);

  return (
    <SectionContainer>
      <SectionHeading title="Add Staff" />
      <form onSubmit={addStaff} className="md:grid md:grid-cols-2 md:gap-4">
        <div>
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
        <br className="md:hidden" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Label htmlFor="department">Department</Label>
              {dptState.loading ? (
                <LoadingSkeleton />
              ) : (
                <Input
                  type="text"
                  id="department"
                  placeholder="Department"
                  value={formData.department}
                  className="cursor-pointer"
                />
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
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
        <br className="md:hidden" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Input
                type="text"
                id="gender"
                placeholder="Gender"
                value={formData.gender}
                className="cursor-pointer"
              />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuRadioGroup
              value={formData.gender}
              onValueChange={(value) =>
                setFormData({ ...formData, gender: value })
              }
            >
              {["Male", "Female", "Other"].map((gender) => (
                <DropdownMenuRadioItem value={gender}>
                  {gender}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="mobile">Mobile</Label>
          <Input
            type="tel"
            id="mobile"
            placeholder="Mobile"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="photo">Photo</Label>
          <Input id="photo" type="file" onChange={handleImageUpload} />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="dob">Date of Birth</Label>
          <Input
            type="date"
            id="dob"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="doj">Date of Joining</Label>
          <Input
            type="date"
            id="doj"
            value={formData.dateOfJoining}
            onChange={(e) =>
              setFormData({ ...formData, dateOfJoining: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            placeholder="City"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="state">State</Label>
          <Input
            type="text"
            id="state"
            placeholder="State"
            value={formData.state}
            onChange={(e) =>
              setFormData({ ...formData, state: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            type="text"
            id="country"
            placeholder="Country"
            value={formData.country}
            onChange={(e) =>
              setFormData({ ...formData, country: e.target.value })
            }
          />
        </div>
        <br className="md:hidden" />
        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            placeholder="Address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>
        <br className="" />
        <div className="md:flex justify-end">
          <Button className="w-full active:scale-95 duration-75 md:w-fit">
            {loading ? <Spinner /> : "Submit"}
          </Button>
        </div>
        <br className="md:hidden" />
        <br className="md:hidden" />
      </form>
    </SectionContainer>
  );
}

function LoadingSkeleton() {
  return <Skeleton className="h-8" />;
}
