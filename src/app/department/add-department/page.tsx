import SectionHeading from "@/components/ui/section-heading";
import Form from "./form";
import SectionContainer from "@/components/ui/section-container";

export default function AddDepartment() {
  return (
    <SectionContainer>
      <SectionHeading title="Departments" />
      <div className="flex flex-col lg:w-[60%] border p-9 border-dashed rounded-lg">
        <h3 className="mb-3">Add Department</h3>
        <Form />
      </div>
    </SectionContainer>
  );
}
