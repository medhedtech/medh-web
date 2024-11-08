import React from "react";
import AddUserForm from "./AddUserForm";

const handleFormSubmit = (event) => {
  event.preventDefault();
  console.log("sumbit");
};

const handleCancel = () => {
  console.log("cancle");
};
const AddStudentForm = () => {
  return (
    <div className="flex items-start justify-center w-full bg-gray-100 p-4 pt-9">
      <AddUserForm formType="Student" />
    </div>
  );
};

export default AddStudentForm;
