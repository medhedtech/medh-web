"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import usePostQuery from "@/hooks/postQuery.hook";
import useGetQuery from "@/hooks/getQuery.hook";
import { apiUrls } from "@/apis";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { Loader, Info, AlertCircle, CheckCircle2, XCircle } from "lucide-react";

// Permission Configuration with categories
const PERMISSION_CATEGORIES = {
  management: {
    label: 'Management',
    permissions: [
      { id: 'course_management', label: 'Course Management', description: 'Manage courses, content, and curriculum' },
      { id: 'student_management', label: 'Student Management', description: 'Handle student enrollments and progress' },
      { id: 'instructor_management', label: 'Instructor Management', description: 'Manage instructors and their assignments' },
      { id: 'corporate_management', label: 'Corporate Management', description: 'Handle corporate partnerships and training' },
    ]
  },
  features: {
    label: 'Features',
    permissions: [
      { id: 'generate_certificate', label: 'Generate Certificate', description: 'Create and manage course certificates' },
      { id: 'get_in_touch', label: 'Get In Touch', description: 'Manage contact and inquiry forms' },
      { id: 'enquiry_form', label: 'Enquiry Form', description: 'Handle student and corporate inquiries' },
      { id: 'post_job', label: 'Post Job', description: 'Manage job postings and applications' },
    ]
  },
  content: {
    label: 'Content',
    permissions: [
      { id: 'feedback_and_complaints', label: 'Feedback & Complaints', description: 'Handle user feedback and issues' },
      { id: 'placement_requests', label: 'Placement Requests', description: 'Manage student placement activities' },
      { id: 'blogs', label: 'Blogs', description: 'Manage blog posts and content' },
    ]
  }
};

// Role Configuration with detailed descriptions
const ROLES = [
  { 
    id: 'admin', 
    label: 'Admin', 
    description: 'Standard administrative access',
    details: 'Manages day-to-day operations with limited system configuration access'
  },
  { 
    id: 'super-admin', 
    label: 'Super Admin', 
    description: 'Full system access and control',
    details: 'Has complete control over all system features and configurations'
  },
  { 
    id: 'cooporate-admin', 
    label: 'Corporate Admin', 
    description: 'Corporate training management',
    details: 'Focuses on managing corporate partnerships and training programs'
  },
];

// Form Validation Schema
const schema = yup.object({
  role_description: yup
    .string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must not exceed 500 characters"),
  email: yup
    .string()
    .email("Invalid email format")
    .required("Email is required"),
  admin_role: yup
    .string()
    .required("Role is required")
    .oneOf(['admin', 'super-admin', 'cooporate-admin'], "Invalid role selected"),
  permissions: yup
    .array()
    .of(yup.string())
    .min(1, "At least one permission must be selected")
    .required("Permissions are required"),
}).required();

const DefineRoleForm = () => {
  const router = useRouter();
  const { postQuery, loading: saveLoading } = usePostQuery();
  const { getQuery, loading: fetchLoading } = useGetQuery();
  const [emails, setEmails] = useState([]);
  const [allData, setAllData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [showRoleInfo, setShowRoleInfo] = useState(false);
  const [formTouched, setFormTouched] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    reset,
    setValue,
    watch,
    getValues,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      permissions: [],
    },
  });

  const watchRole = watch("admin_role");
  const watchEmail = watch("email");
  const watchPermissions = watch("permissions");

  // Get selected role details
  const getSelectedRoleDetails = () => {
    return ROLES.find(role => role.id === watchRole);
  };

  // Calculate permission stats
  const getPermissionStats = () => {
    const total = Object.values(PERMISSION_CATEGORIES).reduce(
      (acc, cat) => acc + cat.permissions.length, 
      0
    );
    const selected = watchPermissions?.length || 0;
    return { total, selected };
  };

  // Fetch users based on role
  const fetchEmails = async (role) => {
    try {
      let url = apiUrls.user.getAll;
      if (role) {
        url = `${apiUrls.user.getAll}?admin_role=${role}`;
      }

      await getQuery({
        url,
        onSuccess: (response) => {
          if (response?.data) {
            setAllData(response.data);
            const emailList = response.data.map(user => user.email);
            setEmails(emailList);
          } else {
            toast.error("No users found for the selected role");
            setEmails([]);
            setAllData([]);
          }
        },
        onFail: (error) => {
          console.error("Failed to fetch emails:", error);
          toast.error("Error fetching user list");
          setEmails([]);
          setAllData([]);
        },
      });
    } catch (error) {
      console.error("Error in fetchEmails:", error);
      toast.error("Failed to fetch users");
      setEmails([]);
      setAllData([]);
    }
  };

  useEffect(() => {
    fetchEmails();
  }, []);

  // Update permissions when email changes
  useEffect(() => {
    if (watchEmail) {
      const selectedUser = allData.find(user => user.email === watchEmail);
      if (selectedUser?.permissions) {
        setValue("permissions", selectedUser.permissions);
        toast.info("Loaded existing permissions for selected user");
      } else {
        setValue("permissions", []);
      }
    }
  }, [watchEmail, allData, setValue]);

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
          showToast.success("Role updated successfully!");
          router.push("/dashboards/admin-subpage3");
        },
        onFail: (error) => {
          console.error("Update failed:", error);
          toast.error("Failed to update role. Please try again.");
        },
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  // Handle form reset with confirmation
  const handleReset = () => {
    if (isDirty && !window.confirm("Are you sure you want to reset the form? All changes will be lost.")) {
      return;
    }
    reset();
    setFormTouched(false);
    toast.info("Form has been reset");
  };

  // Loading state
  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">Loading user data...</p>
        </div>
      </div>
    );
  }

  const stats = getPermissionStats();
  const selectedRoleDetails = getSelectedRoleDetails();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Define User Role
                </h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                  Configure user roles and permissions
                </p>
              </div>
              {formTouched && (
                <div className="flex items-center text-sm text-amber-600 dark:text-amber-400">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Unsaved changes
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            onChange={() => !formTouched && setFormTouched(true)}
            className="p-6 space-y-6"
          >
            {/* Role Selection with Info */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Select Role <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowRoleInfo(!showRoleInfo)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <Info className="w-4 h-4" />
                </button>
              </div>
              <select
                {...register("admin_role")}
                onChange={(e) => {
                  setValue("admin_role", e.target.value);
                  fetchEmails(e.target.value);
                }}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.admin_role
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors`}
              >
                <option value="">Select a role</option>
                {ROLES.map(role => (
                  <option key={role.id} value={role.id}>
                    {role.label}
                  </option>
                ))}
              </select>
              {errors.admin_role && (
                <p className="text-sm text-red-500">{errors.admin_role.message}</p>
              )}
              {showRoleInfo && selectedRoleDetails && (
                <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {selectedRoleDetails.label}
                  </h4>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                    {selectedRoleDetails.details}
                  </p>
                </div>
              )}
            </div>

            {/* Email Selection */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Select User <span className="text-red-500">*</span>
              </label>
              <select
                {...register("email")}
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.email
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors`}
              >
                <option value="">Select a user</option>
                {emails.map(email => (
                  <option key={email} value={email}>
                    {email}
                  </option>
                ))}
              </select>
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Role Description */}
            <div className="space-y-1">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                Role Description <span className="text-red-500">*</span>
              </label>
              <textarea
                {...register("role_description")}
                rows="3"
                placeholder="Describe the role and its responsibilities..."
                className={`w-full px-3 py-2 rounded-lg border ${
                  errors.role_description
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-400 transition-colors`}
              />
              {errors.role_description && (
                <p className="text-sm text-red-500">{errors.role_description.message}</p>
              )}
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {getValues("role_description")?.length || 0}/500 characters
              </p>
            </div>

            {/* Permissions with Categories */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Permissions <span className="text-red-500">*</span>
                </label>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {stats.selected} of {stats.total} selected
                </span>
              </div>

              {Object.entries(PERMISSION_CATEGORIES).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.label}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {category.permissions.map(permission => (
                      <div
                        key={permission.id}
                        className={`relative flex items-start p-4 rounded-lg border ${
                          watchPermissions?.includes(permission.id)
                            ? "border-emerald-500 dark:border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                        } transition-colors`}
                      >
                        <div className="min-w-0 flex-1">
                          <label className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 select-none">
                            <input
                              type="checkbox"
                              {...register("permissions")}
                              value={permission.id}
                              className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 dark:border-gray-600 dark:bg-gray-700 dark:checked:bg-emerald-600 mr-2"
                            />
                            {permission.label}
                          </label>
                          <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {permission.description}
                          </p>
                        </div>
                        {watchPermissions?.includes(permission.id) && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 absolute top-2 right-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {errors.permissions && (
                <p className="text-sm text-red-500">{errors.permissions.message}</p>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 transition-colors"
              >
                Reset Form
              </button>
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || saveLoading}
                  className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {(isSubmitting || saveLoading) ? (
                    <>
                      <Loader className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DefineRoleForm;

