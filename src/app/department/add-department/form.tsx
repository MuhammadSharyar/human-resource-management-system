"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import Spinner from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Form() {
  const { toast } = useToast();
  const [dptName, setDptName] = useState("");
  const [loading, setLoading] = useState(false);

  const addDepartment = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (!loading) {
      setLoading(true);
      const res = await fetch("/api/department", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          dptName,
        }),
      }).then((res) => res.json());
      if (res.message === "request successful") {
        toast({
          description: "Department added successfully.",
          duration: 2000,
        });
      } else if (res.message === "request failed") {
        toast({
          variant: "destructive",
          description: "Something went wrong, please try again.",
          duration: 2000,
        });
      } else if (res.message === "invalid length") {
        toast({
          variant: "destructive",
          description: "Department name should be between 3 to 70 characters.",
          duration: 2000,
        });
      } else if (res.message === "already exist") {
        toast({
          variant: "destructive",
          description: "Department with this name already exist.",
          duration: 2000,
        });
      }
      setLoading(false);
      setDptName("");
    }
  };

  return (
    <form className="flex flex-col" onSubmit={addDepartment}>
      {loading ? (
        <SkeletonLoading />
      ) : (
        <Input
          placeholder="Department Name"
          className="mb-3"
          required
          value={dptName}
          onChange={(e) => setDptName(e.target.value)}
        />
      )}
      <Button className="w-fit self-end active:scale-95 duration-75">
        {loading ? <Spinner /> : "Submit"}
      </Button>
    </form>
  );
}

function SkeletonLoading() {
  return <Skeleton className="flex h-8 mb-3" />;
}
