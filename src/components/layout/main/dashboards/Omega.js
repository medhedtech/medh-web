"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import Preloader from "@/components/shared/others/Preloader";
import { getValue } from "@mui/system";

const schema = yup
  .object({
    role_description: yup.string().required("Description is required"),
    email: yup
      .string()
      .email("Invalid email format")
      .required("Email is required"),
    admin_role: yup.string().required("Role is required"),
    permissions: yup
      .array()
      .of(yup.string())
      .required("permissions is required"),
  })
  .required();

const DefineRoleForm = ({ id }) => {
  const router = useRouter();
  const { postQuery, loading } = usePostQuery();
  const { getQuery } = useGetQuery();
  const [emails, setEmails] = React.useState([]);
  const [allData, setAllData] = React.useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    trigger,
  } = useForm({
    resolver: yupResolver(schema),
    // defaultValues: {
    //   permissions
    // },
  });

  const fetchEmails = async (role) => {
    try {
      let url = apiUrls.user.getAll;
      if (role) {
        url = `${apiUrls.user.getAll}?admin_role=${role}`;
      }
      const response = await getQuery({
        url: url,
      });
      // Ensure response and response.data exist
      if (response && response.data) {
        console.log("response.data", response.data);
        const emails = response.data.map((user) => user.email);
        console.log("emails", emails);
        setEmails(emails);
        setAllData(response.data);
      } else {
        console.error("Unexpected response structure:", response);
        toast.error("Error fetching email list.");
      }
    } catch (error) {
      console.error("Failed to fetch emails:", error);
      toast.error("Error fetching email list.");
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Handle form submission
  const onSubmit = async (data) => {
    try {
      await postQuery({
        url: apiUrls?.user?.updateByEmail,
        postData: {
          email: data.email,
          permissions: data.permissions,
          admin_role: data.admin_role,
          role_description: data.role_description,
        },
        onSuccess: () => {
          toast.success("User updated successfully!");
          router.push("/dashboards/admin-subpage3");
        },
        onFail: (error) => {
          console.error("Failed to update user:", error);
          toast.error("Failed to update user. Please try again.");
        },
      });
    } catch (error) {
      console.error("Unexpected error during update:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (loading) {
    return <Preloader />;
  }

  return (
    <div className="flex items-start font-Poppins justify-center min-h-screen pt-9 dark:bg-inherit bg-gray-100 p-8">
      <div className="bg-white w-full max-w-6xl p-8 md:p-10 rounded-lg shadow-md dark:bg-inherit dark:border">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 dark:text-white">
          Define Role
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Role Selection */}
          <div>
            <label
              htmlFor="admin_role"
              className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
            >
              Select Role
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="admin_role"
              {...register("admin_role")}
              className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.admin_role ? "border-red-500" : ""
              }`}
              onChange={(e) => {
                fetchEmails(e.target.value);
              }}
            >
              <option value="">Select</option>
              <option value="admin">Admin</option>
              <option value="super-admin">Super-Admin</option>
              <option value="cooporate-admin">Cooporate-Admin</option>
            </select>
            {errors.admin_role && (
              <p className="text-red-500 text-sm">
                {errors.admin_role.message}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
            >
              Email ID
              <span className="text-red-500 ml-1">*</span>
            </label>
            <select
              id="email"
              {...register("email")}
              onChange={(e) => {
                const selected = allData.find(
                  (u) => u.email === e.target.value
                );
                console.log("selected", selected);
                if (selected) {
                  setValue("permissions", selected.permissions);
                }
              }}
              className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.email ? "border-red-500" : ""
              }`}
            >
              <option value="">Select</option>
              {emails.map((email) => {
                console.log("email option", email);
                return (
                  <option key={email} value={email}>
                    {email}
                  </option>
                );
              })}
            </select>
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          {/* Role Description */}
          <div>
            <label
              htmlFor="role_description"
              className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
            >
              Role Description
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="role_description"
              {...register("role_description")}
              rows="3"
              placeholder="Write description"
              className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                errors.role_description ? "border-red-500" : ""
              }`}
            ></textarea>
            {errors.role_description && (
              <p className="text-red-500 text-sm">
                {errors.role_description.message}
              </p>
            )}
          </div>

          {/* Permissions */}
          <fieldset>
            <legend className="text-sm font-medium text-gray-700 mb-2 dark:text-whitegrey1">
              Permissions
              <span className="text-red-500 ml-1">*</span>
            </legend>
            <div className="space-y-2 dark:text-white">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="course_management"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   console.log("e.target.checked", getValue("permissions"));
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Course Management
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="student_management"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Student Management
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="instructor_management"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Instructor Management
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="corporate_management"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Corporate Management
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="generate_certificate"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Generate Certificate
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="get_in_touch"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Get In Touch
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="enquiry_form"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Enquiry Form
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="post_job"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Post Job
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="feedback_and_complaints"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Feedback And Complaints
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="placement_requests"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Placement Requests
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  value="blogs"
                  {...register("permissions")}
                  className="mr-2 text-indigo-600 focus:ring-indigo-500"
                  // onChange={(e) => {
                  //   if (e.target.checked) {
                  //     setValue("permissions", [
                  //       ...getValue("permissions"),
                  //       e.target.value,
                  //     ]);
                  //   } else {
                  //     setValue("permissions", [
                  //       ...getValue("permissions").filter(
                  //         (permission) => permission !== e.target.value
                  //       ),
                  //     ]);
                  //   }
                  //   trigger("permissions");
                  // }}
                />
                Blogs
              </label>
            </div>
            {errors.permissions && (
              <p className="text-red-500 text-sm">
                {errors.permissions.message}
              </p>
            )}
          </fieldset>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-inherit dark:border dark:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-customGreen text-white rounded-md"
            >
              Save Updates
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DefineRoleForm;

// "use client";

// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
// import usePostQuery from "@/hooks/postQuery.hook";
// import useGetQuery from "@/hooks/getQuery.hook";
// import { apiUrls } from "@/apis";
// import { useForm } from "react-hook-form";
// import * as yup from "yup";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import Preloader from "@/components/shared/others/Preloader";

// const schema = yup
//   .object({
//     role_description: yup.string().required("Description is required"),
//     email: yup
//       .string()
//       .email("Invalid email format")
//       .required("Email is required"),
//     admin_role: yup.string().required("Role is required"),
//     permissions: yup.string().required("permissions is required"),
//   })
//   .required();

// const DefineRoleForm = ({ id }) => {
//   const router = useRouter();
//   const { postQuery, loading } = usePostQuery();
//   const { getQuery } = useGetQuery();
//   const [emails, setEmails] = React.useState([]);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     getValues,
//   } = useForm({
//     resolver: yupResolver(schema),
//   });

//   const fetchEmails = async (role) => {
//     try {
//       const response = await getQuery({
//         url: apiUrls.user.getAll,
//       });
//       // Ensure response and response.data exist
//       if (response && response.data) {

//         if(role){
//           console.log("getValues",getValues("admin_role"))
//           setEmails(response.data.filter((user) => user.admin_role === role)).map((user) => user.email);
//         }else{
//           const emails = response.data.map((user) => user.email);
//           setEmails(emails);
//         }
//       } else {
//         console.error("Unexpected response structure:", response);
//         toast.error("Error fetching email list.");
//       }
//     } catch (error) {
//       console.error("Failed to fetch emails:", error);
//       toast.error("Error fetching email list.");
//     }
//   };

//   useEffect(() => {

//     fetchEmails();
//   }, []);

//   // Handle form submission
//   const onSubmit = async (data) => {
//     try {
//       await postQuery({
//         url: apiUrls?.user?.updateByEmail,
//         postData: {
//           email: data.email,
//           permissions: [data.permissions],
//           admin_role: data.admin_role,
//           role_description: data.role_description,
//         },
//         onSuccess: () => {
//           toast.success("User updated successfully!");
//           router.push("/dashboards/admin-subpage3");
//         },
//         onFail: (error) => {
//           console.error("Failed to update user:", error);
//           toast.error("Failed to update user. Please try again.");
//         },
//       });
//     } catch (error) {
//       console.error("Unexpected error during update:", error);
//       toast.error("An unexpected error occurred. Please try again.");
//     }
//   };

//   if (loading) {
//     return <Preloader />;
//   }

//   return (
//     <div className="flex items-start font-Poppins justify-center min-h-screen pt-9 dark:bg-inherit bg-gray-100 p-8">
//       <div className="bg-white w-full max-w-6xl p-8 md:p-10 rounded-lg shadow-md dark:bg-inherit dark:border">
//         <h2 className="text-2xl font-semibold text-gray-800 mb-6 dark:text-white">
//           Define Role
//         </h2>

//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//            {/* Role Selection */}
//            <div>
//             <label
//               htmlFor="admin_role"
//               className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
//             >
//               Select Role
//               <span className="text-red-500 ml-1">*</span>
//             </label>
//             <select
//               id="admin_role"
//               {...register("admin_role")}
//               className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                 errors.admin_role ? "border-red-500" : ""
//               }`}

//               onChange={(e)=>{
//                 console.log("onchange called",e.target.value)
//                 fetchEmails(e.target.value)
//               }
//               }
//             >
//               <option value="">Select</option>
//               <option value="admin">Admin</option>
//               <option value="super-admin">Super-Admin</option>
//               <option value="cooporate-admin">Cooporate-Admin</option>
//             </select>
//             {errors.admin_role && (
//               <p className="text-red-500 text-sm">
//                 {errors.admin_role.message}
//               </p>
//             )}
//           </div>
//           {/* Email Input */}
//           <div>
//             <label
//               htmlFor="email"
//               className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
//             >
//               Email ID
//               <span className="text-red-500 ml-1">*</span>
//             </label>
//             <select
//               id="email"
//               {...register("email")}
//               className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                 errors.email ? "border-red-500" : ""
//               }`}
//             >
//               <option value="">Select</option>
//               {emails.map((email) => (
//                 <option key={email} value={email}>
//                   {email}
//                 </option>
//               ))}
//             </select>
//             {errors.email && (
//               <p className="text-red-500 text-sm">{errors.email.message}</p>
//             )}
//           </div>

//           {/* Role Description */}
//           <div>
//             <label
//               htmlFor="role_description"
//               className="block text-sm font-medium text-gray-700 dark:text-whitegrey1"
//             >
//               Role Description
//               <span className="text-red-500 ml-1">*</span>
//             </label>
//             <textarea
//               id="role_description"
//               {...register("role_description")}
//               rows="3"
//               placeholder="Write description"
//               className={`w-full mt-1 px-3 py-2 border dark:bg-inherit dark:text-whitegrey3 border-gray-300 rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
//                 errors.role_description ? "border-red-500" : ""
//               }`}
//             ></textarea>
//             {errors.role_description && (
//               <p className="text-red-500 text-sm">
//                 {errors.role_description.message}
//               </p>
//             )}
//           </div>

//           {/* Permissions */}
//           <fieldset>
//             <legend className="text-sm font-medium text-gray-700 mb-2 dark:text-whitegrey1">
//               Permissions
//               <span className="text-red-500 ml-1">*</span>
//             </legend>
//             <div className="space-y-2 dark:text-white">
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="view_courses"
//                   {...register("permissions")}
//                   className="mr-2 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 View Courses
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="edit_users"
//                   {...register("permissions")}
//                   className="mr-2 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 Edit Users
//               </label>
//               <label className="flex items-center">
//                 <input
//                   type="radio"
//                   value="create_report"
//                   {...register("permissions")}
//                   className="mr-2 text-indigo-600 focus:ring-indigo-500"
//                 />
//                 Create Report
//               </label>
//             </div>
//             {errors.permissions && (
//               <p className="text-red-500 text-sm">
//                 {errors.permissions.message}
//               </p>
//             )}
//           </fieldset>

//           {/* Buttons */}
//           <div className="flex justify-end space-x-4">
//             <button
//               type="button"
//               onClick={() => reset()}
//               className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 dark:bg-inherit dark:border dark:text-white"
//             >
//               Cancel
//             </button>
//             <button
//               type="submit"
//               className="px-4 py-2 bg-customGreen text-white rounded-md"
//             >
//               Save Updates
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DefineRoleForm;
