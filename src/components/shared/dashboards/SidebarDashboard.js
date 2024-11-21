"use client";

import { usePathname } from "next/navigation";
import ItemsDashboard from "./ItemsDashboard";
import Image from "next/image";
import NavbarLogo from "@/components/layout/header/NavbarLogo";

const SidebarDashboard = () => {
  const pathname = usePathname();
  const partOfPathNaem = pathname.split("/")[2].split("-")[0];
  const isAdmin = partOfPathNaem === "admin" ? true : false;
  const isInstructor = partOfPathNaem === "instructor" ? true : false;
  const adminItems = [
    {
      // title: "MAIN",
      items: [
        {
          name: "Dashboard",
          path: "/dashboards/admin-dashboard",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },
        {
          name: "User Management",
          path: null,
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto"
            >
              <path
                d="M7.99996 8.41764C9.84091 8.41764 11.3333 6.92526 11.3333 5.08431C11.3333 3.24336 9.84091 1.75098 7.99996 1.75098C6.15901 1.75098 4.66663 3.24336 4.66663 5.08431C4.66663 6.92526 6.15901 8.41764 7.99996 8.41764Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.7266 15.0841C13.7266 12.5041 11.16 10.4175 7.99998 10.4175C4.83998 10.4175 2.27332 12.5041 2.27332 15.0841"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
          subItems: [
            {
              name: "Create User",
              path: "/dashboards/admin-subpage1",
              icon: (
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="my-auto"
                >
                  <path
                    d="M7.99996 8.41764C9.84091 8.41764 11.3333 6.92526 11.3333 5.08431C11.3333 3.24336 9.84091 1.75098 7.99996 1.75098C6.15901 1.75098 4.66663 3.24336 4.66663 5.08431C4.66663 6.92526 6.15901 8.41764 7.99996 8.41764Z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M13.7266 15.0841C13.7266 12.5041 11.16 10.4175 7.99998 10.4175C4.83998 10.4175 2.27332 12.5041 2.27332 15.0841"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              name: "Define Role",
              path: "/dashboards/admin-subpage2",
              icon: (
                <svg
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="my-auto"
                >
                  <path
                    d="M8 1.5l5 2.5v5l-5 2.5-5-2.5v-5l5-2.5z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 11h8"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 8h4"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              name: "View User",
              path: "/dashboards/admin-subpage3",
              icon: (
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 10C12.4853 10 14.5 7.98528 14.5 5.5C14.5 3.01472 12.4853 1 10 1C7.51472 1 5.5 3.01472 5.5 5.5C5.5 7.98528 7.51472 10 10 10Z"
                    fill="#808080"
                  />
                  <path
                    d="M0 16.2893V14.6573L1.012 14.4893C1.067 14.2693 1.176 14.0523 1.336 13.7293L1.35 13.7013L0.731 12.8573L1.912 11.6773L2.756 12.2953C3.00267 12.1446 3.26533 12.032 3.544 11.9573L3.656 10.9453H5.288L5.429 11.7963L5.456 11.9573C5.738 12.0133 5.963 12.1273 6.244 12.2953L7.088 11.6763L8.268 12.8573L7.706 13.7013C7.812 13.8773 7.874 14.0313 7.933 14.1913L7.958 14.2613L7.968 14.2883C7.99133 14.3523 8.01667 14.419 8.044 14.4883L9 14.6013V16.2323L7.988 16.4023C7.931 16.6823 7.818 16.9073 7.65 17.1883L8.213 18.0323L7.244 19.0013L7.031 19.2143L6.711 19.0013L6.187 18.6513C5.988 18.7513 5.744 18.8513 5.496 18.9513L5.446 18.9713L5.4 18.9893L5.398 19.0013L5.231 20.0013H3.544L3.377 19.0013L3.375 18.9893C3.094 18.9323 2.869 18.8193 2.588 18.6513L2.111 19.0013L1.744 19.2713L0.562 18.0893L1.182 17.2453C1.03218 17.0002 0.918355 16.7348 0.844 16.4573L0 16.2893ZM4.5 17.1323C4.72263 17.1361 4.94375 17.0951 5.15019 17.0116C5.35663 16.9282 5.54418 16.8041 5.70167 16.6467C5.85917 16.4893 5.98338 16.3018 6.06693 16.0954C6.15048 15.889 6.19165 15.6679 6.188 15.4453C6.188 14.4893 5.456 13.7573 4.5 13.7573C3.544 13.7573 2.812 14.4893 2.812 15.4453C2.812 16.4013 3.544 17.1323 4.5 17.1323ZM10 11.0013C9.261 11.0013 8.582 11.0483 7.96 11.1343L9.554 12.7303L8.98 13.5923L10 13.7123V17.0793L8.902 17.2623L9.5 18.1593L8.658 19.0013H18V16.0013C18 14.0013 15.917 11.0013 10 11.0013Z"
                    fill="#808080"
                  />
                </svg>
              ),
            },
          ],
        },

        {
          name: "Course Management",
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 22C5.45 22 4.97933 21.8043 4.588 21.413C4.19667 21.0217 4.00067 20.5507 4 20V4C4 3.45 4.196 2.97933 4.588 2.588C4.98 2.19667 5.45067 2.00067 6 2H18C18.55 2 19.021 2.196 19.413 2.588C19.805 2.98 20.0007 3.45067 20 4V20C20 20.55 19.8043 21.021 19.413 21.413C19.0217 21.805 18.5507 22.0007 18 22H6ZM11 11L13.5 9.5L16 11V4H11V11Z"
                fill="#808080"
              />
            </svg>
          ),
          subItems: [
            {
              name: "List of Courses",
              path: "/dashboards/admin-listofcourse",
              icon: (
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H20.25C20.4489 21 20.6397 20.921 20.7803 20.7803C20.921 20.6397 21 20.4489 21 20.25V3.75C21 3.55109 20.921 3.36032 20.7803 3.21967C20.6397 3.07902 20.4489 3 20.25 3H3.75ZM6 9H15V7.5H6V9ZM16.5 9H18V7.5H16.5V9ZM15 12.75H6V11.25H15V12.75ZM16.5 12.75H18V11.25H16.5V12.75ZM15 16.5H6V15H15V16.5ZM16.5 16.5H18V15H16.5V16.5Z"
                    fill="#808080"
                  />
                </svg>
              ),
            },
            {
              name: "Add Course",
              path: "/dashboards/admin-addcourse",
              icon: (
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 1.5C9.22568 1.53366 6.57448 2.65072 4.6126 4.6126C2.65072 6.57448 1.53366 9.22568 1.5 12C1.53366 14.7743 2.65072 17.4255 4.6126 19.3874C6.57448 21.3493 9.22568 22.4663 12 22.5C14.7743 22.4663 17.4255 21.3493 19.3874 19.3874C21.3493 17.4255 22.4663 14.7743 22.5 12C22.4663 9.22568 21.3493 6.57448 19.3874 4.6126C17.4255 2.65072 14.7743 1.53366 12 1.5ZM18 12.75H12.75V18H11.25V12.75H6V11.25H11.25V6H12.75V11.25H18V12.75Z"
                    fill="#808080"
                  />
                </svg>
              ),
            },
            {
              name: "Schedule Classes",
              path: "/dashboards/admin-schonlineclass",
              icon: (
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.892 2.03012C6.6008 2.13454 6.31685 2.25814 6.042 2.40012C5.94283 2.45217 5.84545 2.50754 5.75 2.56612L5.732 2.57812L5.726 2.58212L5.724 2.58312L5.723 2.58412C5.61254 2.65759 5.53578 2.77193 5.50962 2.90198C5.48346 3.03204 5.51004 3.16716 5.5835 3.27762C5.65696 3.38809 5.7713 3.46484 5.90136 3.491C6.03141 3.51716 6.16654 3.49059 6.277 3.41712L6.284 3.41212L6.325 3.38712C6.36367 3.36312 6.42367 3.32979 6.505 3.28712C6.667 3.20212 6.912 3.08712 7.233 2.97012C8.12096 2.65364 9.05734 2.49459 10 2.50012C11.183 2.50012 12.125 2.73612 12.767 2.97012C13.087 3.08712 13.333 3.20212 13.495 3.28712C13.5696 3.32646 13.643 3.36815 13.715 3.41212L13.723 3.41612C13.7776 3.45482 13.8393 3.48217 13.9047 3.49655C13.97 3.51094 14.0376 3.51207 14.1033 3.49988C14.1691 3.48768 14.2318 3.46242 14.2876 3.42557C14.3434 3.38872 14.3913 3.34105 14.4284 3.28537C14.4655 3.22969 14.491 3.16713 14.5034 3.10141C14.5159 3.03569 14.5151 2.96813 14.5009 2.90274C14.4868 2.83735 14.4597 2.77546 14.4213 2.72073C14.3828 2.666 14.3337 2.61955 14.277 2.58412L14.276 2.58312L14.274 2.58212L14.268 2.57812L14.249 2.56612L14.187 2.52712C14.1115 2.48278 14.0348 2.44043 13.957 2.40012C13.6825 2.25818 13.3989 2.13458 13.108 2.03012C12.1107 1.67396 11.0589 1.49461 10 1.50012C8.94105 1.49461 7.88927 1.67396 6.892 2.03012ZM6.892 17.9701C7.625 18.2371 8.682 18.5001 10 18.5001C11.0589 18.5056 12.1107 18.3263 13.108 17.9701C13.475 17.8371 13.761 17.7021 13.958 17.6001C14.0568 17.5481 14.1539 17.4927 14.249 17.4341L14.268 17.4221L14.274 17.4181L14.276 17.4171C14.276 17.4171 14.277 17.4161 14 17.0001L14.277 17.4161C14.3831 17.3409 14.4557 17.2273 14.4794 17.0994C14.5031 16.9715 14.4761 16.8394 14.404 16.7311C14.3319 16.6229 14.2204 16.547 14.0933 16.5195C13.9662 16.4921 13.8333 16.5152 13.723 16.5841L13.715 16.5891L13.675 16.6131C13.6159 16.648 13.5558 16.6813 13.495 16.7131C13.333 16.7981 13.088 16.9131 12.767 17.0301C11.879 17.3466 10.9427 17.5057 10 17.5001C9.05734 17.5057 8.12096 17.3466 7.233 17.0301C6.9836 16.9406 6.7404 16.8347 6.505 16.7131C6.43037 16.6738 6.357 16.6321 6.285 16.5881L6.277 16.5831C6.2223 16.5467 6.16098 16.5215 6.09653 16.5088C6.03207 16.4961 5.96576 16.4963 5.90136 16.5092C5.83696 16.5222 5.77575 16.5477 5.72121 16.5843C5.66667 16.6209 5.61988 16.6679 5.5835 16.7226C5.54712 16.7773 5.52188 16.8386 5.5092 16.9031C5.49653 16.9676 5.49667 17.0339 5.50962 17.0983C5.52258 17.1627 5.54809 17.2239 5.5847 17.2784C5.62131 17.333 5.6683 17.3797 5.723 17.4161L5.724 17.4171L5.726 17.4181L5.732 17.4221L5.75 17.4341L5.813 17.4721C5.86633 17.5055 5.943 17.5478 6.043 17.5991C6.239 17.7021 6.525 17.8381 6.892 17.9701ZM2.5 7.00012V13.0001C2.5 13.5306 2.71071 14.0393 3.08579 14.4143C3.46086 14.7894 3.96957 15.0001 4.5 15.0001H10.5C11.0304 15.0001 11.5391 14.7894 11.9142 14.4143C12.2893 14.0393 12.5 13.5306 12.5 13.0001V7.00012C12.5 6.46969 12.2893 5.96098 11.9142 5.58591C11.5391 5.21084 11.0304 5.00012 10.5 5.00012H4.5C3.96957 5.00012 3.46086 5.21084 3.08579 5.58591C2.71071 5.96098 2.5 6.46969 2.5 7.00012ZM13.5 11.5501L16.277 13.8071C16.387 13.8965 16.5201 13.9529 16.6609 13.9698C16.8016 13.9866 16.9443 13.9632 17.0723 13.9023C17.2003 13.8414 17.3084 13.7455 17.3841 13.6256C17.4598 13.5057 17.5 13.3669 17.5 13.2251V6.77512C17.5 6.63336 17.4598 6.49451 17.3841 6.37465C17.3084 6.2548 17.2003 6.15885 17.0723 6.09794C16.9443 6.03702 16.8016 6.01363 16.6609 6.03048C16.5201 6.04733 16.387 6.10372 16.277 6.19312L13.5 8.45012V11.5501Z"
                    fill="#808080"
                  />
                </svg>
              ),
            },
            {
              name: "Assign Insctructor",
              path: "/dashboards/admin-assigninstructor",
              icon: (
                <svg
                  width="16"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M3.75 3C3.55109 3 3.36032 3.07902 3.21967 3.21967C3.07902 3.36032 3 3.55109 3 3.75V20.25C3 20.4489 3.07902 20.6397 3.21967 20.7803C3.36032 20.921 3.55109 21 3.75 21H20.25C20.4489 21 20.6397 20.921 20.7803 20.7803C20.921 20.6397 21 20.4489 21 20.25V3.75C21 3.55109 20.921 3.36032 20.7803 3.21967C20.6397 3.07902 20.4489 3 20.25 3H3.75ZM6 9H15V7.5H6V9ZM16.5 9H18V7.5H16.5V9ZM15 12.75H6V11.25H15V12.75ZM16.5 12.75H18V11.25H16.5V12.75ZM15 16.5H6V15H15V16.5ZM16.5 16.5H18V15H16.5V16.5Z"
                    fill="#808080"
                  />
                </svg>
              ),
            },
          ],
        },
        {
          name: "Student Management",
          path: "/dashboards/admin-studentmange",
          // tag: 12,
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto"
            >
              <path
                d="M7.99996 8.41764C9.84091 8.41764 11.3333 6.92526 11.3333 5.08431C11.3333 3.24336 9.84091 1.75098 7.99996 1.75098C6.15901 1.75098 4.66663 3.24336 4.66663 5.08431C4.66663 6.92526 6.15901 8.41764 7.99996 8.41764Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.7266 15.0841C13.7266 12.5041 11.16 10.4175 7.99998 10.4175C4.83998 10.4175 2.27332 12.5041 2.27332 15.0841"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Instructor Management",
          path: "/dashboards/admin-Instuctoremange",
          // tag: 12,
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_563_2039)">
                <path
                  d="M7.80006 13.5984C7.71044 13.5984 7.62081 13.6116 7.53531 13.6393C7.04931 13.7972 6.53819 13.8984 6.00006 13.8984C5.46194 13.8984 4.95081 13.7972 4.46444 13.6393C4.37894 13.6116 4.28969 13.5984 4.20006 13.5984C1.87281 13.5984 -0.0123144 15.4914 6.05804e-05 17.8217C0.00531058 18.8064 0.814935 19.5984 1.80006 19.5984H10.2001C11.1852 19.5984 11.9948 18.8064 12.0001 17.8217C12.0124 15.4914 10.1273 13.5984 7.80006 13.5984ZM6.00006 12.3984C7.98831 12.3984 9.60006 10.7867 9.60006 8.79844C9.60006 6.81019 7.98831 5.19844 6.00006 5.19844C4.01181 5.19844 2.40006 6.81019 2.40006 8.79844C2.40006 10.7867 4.01181 12.3984 6.00006 12.3984ZM22.2001 0.398438H7.80006C6.80744 0.398438 6.00006 1.23281 6.00006 2.25806V3.99844C6.87831 3.99844 7.69131 4.25269 8.40006 4.66594V2.79844H21.6001V13.5984H19.2001V11.1984H14.4001V13.5984H11.5411C12.2573 14.2243 12.7831 15.0508 13.0294 15.9984H22.2001C23.1927 15.9984 24.0001 15.1641 24.0001 14.1388V2.25806C24.0001 1.23281 23.1927 0.398438 22.2001 0.398438Z"
                  fill="#808080"
                />
              </g>
              <defs>
                <clipPath id="clip0_563_2039">
                  <rect
                    width="24"
                    height="19.2"
                    fill="white"
                    transform="translate(0 0.398438)"
                  />
                </clipPath>
              </defs>
            </svg>
          ),
        },
        {
          name: "Categories Management",
          path: "/dashboards/admin-category-manage",
          // tag: 12,
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_563_2039)">
                <path
                  d="M7.80006 13.5984C7.71044 13.5984 7.62081 13.6116 7.53531 13.6393C7.04931 13.7972 6.53819 13.8984 6.00006 13.8984C5.46194 13.8984 4.95081 13.7972 4.46444 13.6393C4.37894 13.6116 4.28969 13.5984 4.20006 13.5984C1.87281 13.5984 -0.0123144 15.4914 6.05804e-05 17.8217C0.00531058 18.8064 0.814935 19.5984 1.80006 19.5984H10.2001C11.1852 19.5984 11.9948 18.8064 12.0001 17.8217C12.0124 15.4914 10.1273 13.5984 7.80006 13.5984ZM6.00006 12.3984C7.98831 12.3984 9.60006 10.7867 9.60006 8.79844C9.60006 6.81019 7.98831 5.19844 6.00006 5.19844C4.01181 5.19844 2.40006 6.81019 2.40006 8.79844C2.40006 10.7867 4.01181 12.3984 6.00006 12.3984ZM22.2001 0.398438H7.80006C6.80744 0.398438 6.00006 1.23281 6.00006 2.25806V3.99844C6.87831 3.99844 7.69131 4.25269 8.40006 4.66594V2.79844H21.6001V13.5984H19.2001V11.1984H14.4001V13.5984H11.5411C12.2573 14.2243 12.7831 15.0508 13.0294 15.9984H22.2001C23.1927 15.9984 24.0001 15.1641 24.0001 14.1388V2.25806C24.0001 1.23281 23.1927 0.398438 22.2001 0.398438Z"
                  fill="#808080"
                />
              </g>
              <defs>
                <clipPath id="clip0_563_2039">
                  <rect
                    width="24"
                    height="19.2"
                    fill="white"
                    transform="translate(0 0.398438)"
                  />
                </clipPath>
              </defs>
            </svg>
          ),
        },
        {
          name: "Generate Certificate",
          path: "/dashboards/admin-GenrateCertificate",
          // tag: 12,
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 21L15 20L17 21V14H13M17 9V7L15 8L13 7V9L11 10L13 11V13L15 12L17 13V11L19 10M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H11V15H4V5H20V15H19V17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM11 8H5V6H11M9 11H5V9H9M11 14H5V12H11V14Z"
                fill="#808080"
              />
            </svg>
          ),
        },
        {
          name: "Get In Touch",
          path: "/dashboards/admin-get-in-touch",
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 21L15 20L17 21V14H13M17 9V7L15 8L13 7V9L11 10L13 11V13L15 12L17 13V11L19 10M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H11V15H4V5H20V15H19V17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM11 8H5V6H11M9 11H5V9H9M11 14H5V12H11V14Z"
                fill="#808080"
              />
            </svg>
          ),
        },
        {
          name: "Enrollments",
          path: "/dashboards/admin-enrollments",
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 21L15 20L17 21V14H13M17 9V7L15 8L13 7V9L11 10L13 11V13L15 12L17 13V11L19 10M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H11V15H4V5H20V15H19V17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM11 8H5V6H11M9 11H5V9H9M11 14H5V12H11V14Z"
                fill="#808080"
              />
            </svg>
          ),
        },
        {
          name: "Job Applications",
          path: "/dashboards/admin-job-applicants",
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 21L15 20L17 21V14H13M17 9V7L15 8L13 7V9L11 10L13 11V13L15 12L17 13V11L19 10M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H11V15H4V5H20V15H19V17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM11 8H5V6H11M9 11H5V9H9M11 14H5V12H11V14Z"
                fill="#808080"
              />
            </svg>
          ),
        },
        {
          name: "Blogs",
          path: "/dashboards/admin-blogs",
          icon: (
            <svg
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M13 21L15 20L17 21V14H13M17 9V7L15 8L13 7V9L11 10L13 11V13L15 12L17 13V11L19 10M20 3H4C3.46957 3 2.96086 3.21071 2.58579 3.58579C2.21071 3.96086 2 4.46957 2 5V15C2 15.5304 2.21071 16.0391 2.58579 16.4142C2.96086 16.7893 3.46957 17 4 17H11V15H4V5H20V15H19V17H20C20.5304 17 21.0391 16.7893 21.4142 16.4142C21.7893 16.0391 22 15.5304 22 15V5C22 4.46957 21.7893 3.96086 21.4142 3.58579C21.0391 3.21071 20.5304 3 20 3ZM11 8H5V6H11M9 11H5V9H9M11 14H5V12H11V14Z"
                fill="#808080"
              />
            </svg>
          ),
        },
      ],
    },

    {
      name: "Student Management",
      path: "/dashboards/admin-studentmange",
      // tag: 12,
      icon: (
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          stroke="currentColor"
          xmlns="http://www.w3.org/2000/svg"
          className="my-auto"
        >
          <path
            d="M7.99996 8.41764C9.84091 8.41764 11.3333 6.92526 11.3333 5.08431C11.3333 3.24336 9.84091 1.75098 7.99996 1.75098C6.15901 1.75098 4.66663 3.24336 4.66663 5.08431C4.66663 6.92526 6.15901 8.41764 7.99996 8.41764Z"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M13.7266 15.0841C13.7266 12.5041 11.16 10.4175 7.99998 10.4175C4.83998 10.4175 2.27332 12.5041 2.27332 15.0841"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      ),
    },
    {
      title: "SETTINGS",
      items: [
        // {
        //   name: "Settings",
        //   path: "#",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="16"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-settings"
        //     >
        //       <circle cx="12" cy="12" r="3"></circle>
        //       <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
        //     </svg>
        //   ),
        // },
        {
          name: "Logout",
          path: "/login",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-log-out"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          ),
        },
        // {
        //   name: "Help Center",
        //   path: "#",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="16"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-help-circle"
        //     >
        //       <circle cx="12" cy="12" r="10"></circle>
        //       <path d="M9.09 9a3 3 0 1 1 5.82 1c0 1.5-1.5 2-1.5 2"></path>
        //       <line x1="12" y1="17" x2="12" y2="17"></line>
        //     </svg>
        //   ),
        // },
      ],
    },
  ];
  const instructorItems = [
    {
      title: "MICHLE OBEMA",
      items: [
        {
          name: "Dashboard",
          path: "/dashboards/instructor-dashboard",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },
        {
          name: "My Profile",
          path: "/dashboards/instructor-profile",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-user"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          ),
        },
        {
          name: "Message",
          path: "/dashboards/instructor-message",
          tag: 12,
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-book-open"
            >
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
            </svg>
          ),
        },
        {
          name: "Wishlist",
          path: "/dashboards/instructor-wishlist",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-bookmark"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
            </svg>
          ),
        },
        {
          name: "Reviews",
          path: "/dashboards/instructor-reviews",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-star"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
            </svg>
          ),
        },
        {
          name: "My Quiz Attempts",
          path: "/dashboards/instructor-my-quiz-attempts",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-help-circle"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
          ),
        },
        {
          name: "Order History",
          path: "/dashboards/instructor-order-history",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-shopping-bag"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          ),
        },
      ],
    },
    {
      title: "INSTRUCTOR",
      items: [
        {
          name: "My Course",
          path: "/dashboards/instructor-course",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-monitor"
            >
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
              <line x1="8" y1="21" x2="16" y2="21"></line>
              <line x1="12" y1="17" x2="12" y2="21"></line>
            </svg>
          ),
        },
        {
          name: "Announcments",
          path: "/dashboards/instructor-announcments",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-volume-1"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ),
        },
        {
          name: "Quiz Attempt",
          path: "/dashboards/instructor-quiz-attempts",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-message-square"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
          ),
        },
        {
          name: "Assignments",
          path: "/dashboards/instructor-assignments",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-volume-1"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ),
        },
      ],
    },

    {
      title: "USER",
      items: [
        {
          name: "Settings",
          path: "/dashboards/instructor-settings",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-settings"
            >
              <circle cx="12" cy="12" r="3"></circle>
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
            </svg>
          ),
        },
        {
          name: "Logout",
          path: "#",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-volume-1"
            >
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
          ),
        },
      ],
    },
  ];

  const studentItems = [
    {
      title: "WELCOME, DOND TOND",
      items: [
        {
          name: "Dashboard",
          path: "/dashboards/student-dashboard",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="feather feather-home"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
          ),
        },
        {
          name: "My Courses",
          path: "/dashboards/my-courses",
          icon: (
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto"
            >
              <path
                d="M4.34269 0.750977C3.47336 0.836977 2.88803 1.03031 2.45069 1.46831C1.66736 2.25298 1.66736 3.51631 1.66736 6.04364V8.72364C1.66736 11.2503 1.66736 12.5143 2.45069 13.2996C3.23403 14.085 4.49536 14.0843 7.01736 14.0843H8.35536C10.8774 14.0843 12.1387 14.0843 12.922 13.2996C13.6334 12.5863 13.6994 11.4883 13.7054 9.40231"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.01731 4.08426L7.68597 6.41759C8.05931 7.15759 8.52797 7.35092 9.69264 7.41759C10.6186 7.39492 11.156 7.28559 11.6146 6.88692C11.9273 6.61492 12.0686 6.20492 12.1373 5.79692L12.3666 4.41759M14.0386 3.08426V6.41759M5.73397 2.70626C6.79197 1.82826 7.73464 1.35692 9.68997 0.838257C9.91056 0.780018 10.1426 0.781168 10.3626 0.841591C12.0933 1.31759 13.028 1.74026 14.28 2.68026C14.3333 2.72026 14.3493 2.79492 14.312 2.85026C13.9033 3.45159 12.9906 3.93892 10.752 4.80692C10.2857 4.98634 9.76891 4.98349 9.30464 4.79892C6.92064 3.85226 5.82464 3.34559 5.69131 2.81959C5.68697 2.7986 5.68868 2.77681 5.69623 2.75675C5.70378 2.73669 5.71687 2.71918 5.73397 2.70626Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "My Membership",
          path: "/dashboards/student-membership",
          // tag: 12,
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              className="my-auto"
            >
              <path
                d="M7.99996 8.41764C9.84091 8.41764 11.3333 6.92526 11.3333 5.08431C11.3333 3.24336 9.84091 1.75098 7.99996 1.75098C6.15901 1.75098 4.66663 3.24336 4.66663 5.08431C4.66663 6.92526 6.15901 8.41764 7.99996 8.41764Z"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M13.7266 15.0841C13.7266 12.5041 11.16 10.4175 7.99998 10.4175C4.83998 10.4175 2.27332 12.5041 2.27332 15.0841"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Resources",
          path: "/dashboards/student-enrolled-courses",
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              stroke="currentColor"
              className="my-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.66667 7.75081H12M6.66667 9.75081H9.33333M6.66667 5.75081H12M13.3333 15.0841H5.6C3.61333 15.0841 2 13.4708 2 11.4841V3.75081M5.6 2.41748H13.0667C13.2768 2.41748 13.4848 2.45887 13.679 2.53927C13.8731 2.61968 14.0495 2.73754 14.198 2.88611C14.3466 3.03468 14.4645 3.21107 14.5449 3.40519C14.6253 3.59931 14.6667 3.80737 14.6667 4.01748V11.4841C14.6667 11.9085 14.4981 12.3155 14.198 12.6155C13.898 12.9156 13.491 13.0841 13.0667 13.0841H5.6C5.38988 13.0841 5.18183 13.0428 4.98771 12.9624C4.79359 12.8819 4.6172 12.7641 4.46863 12.6155C4.16857 12.3155 4 11.9085 4 11.4841V4.01748C4 3.80737 4.04139 3.59931 4.12179 3.40519C4.2022 3.21107 4.32006 3.03468 4.46863 2.88611C4.76869 2.58605 5.17565 2.41748 5.6 2.41748Z"
                stroke-width="1.5"
                stroke-miterlimit="10"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
        // {
        //   name: "Wishlist",
        //   path: "/dashboards/student-wishlist",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="16"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-bookmark"
        //     >
        //       <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
        //     </svg>
        //   ),
        // },
        // {
        //   name: "Reviews",
        //   path: "/dashboards/student-reviews",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="16"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-star"
        //     >
        //       <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        //     </svg>
        //   ),
        // },
        {
          name: "Assignments & Quizzes",
          path: "/dashboards/student-quiz",
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="my-auto"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.74396 13.751C3.44529 13.751 3.19107 13.6461 2.98129 13.4363C2.77151 13.2265 2.66663 12.9725 2.66663 12.6743V4.16098C2.66663 3.8632 2.77151 3.6092 2.98129 3.39898C3.19107 3.1892 3.44529 3.08431 3.74396 3.08431H6.87729C6.8164 2.74387 6.89774 2.43653 7.12129 2.16231C7.3444 1.88809 7.63729 1.75098 7.99996 1.75098C8.37107 1.75098 8.6684 1.88809 8.89196 2.16231C9.11552 2.43653 9.19263 2.74387 9.12329 3.08431H12.2566C12.5544 3.08431 12.8084 3.1892 13.0186 3.39898C13.2284 3.60875 13.3333 3.86298 13.3333 4.16164V12.6743C13.3333 12.9721 13.2284 13.2261 13.0186 13.4363C12.8088 13.6461 12.5548 13.751 12.2566 13.751H3.74396ZM3.74396 13.0843H12.2566C12.3588 13.0843 12.4528 13.0416 12.5386 12.9563C12.6244 12.871 12.6671 12.7768 12.6666 12.6736V4.16164C12.6666 4.05898 12.624 3.96475 12.5386 3.87898C12.4533 3.7932 12.3591 3.75053 12.256 3.75098H3.74396C3.64129 3.75098 3.54707 3.79364 3.46129 3.87898C3.37551 3.96431 3.33285 4.05853 3.33329 4.16164V12.6743C3.33329 12.7765 3.37596 12.8705 3.46129 12.9563C3.54663 13.0421 3.64063 13.0848 3.74329 13.0843M4.99996 11.2643H8.99996V10.5976H4.99996V11.2643ZM4.99996 8.75098H11V8.08431H4.99996V8.75098ZM4.99996 6.23764H11V5.57098H4.99996V6.23764ZM7.99996 3.37964C8.1444 3.37964 8.26396 3.33253 8.35863 3.23831C8.45329 3.14409 8.5004 3.02453 8.49996 2.87964C8.49952 2.73475 8.45218 2.61542 8.35796 2.52164C8.26374 2.42787 8.1444 2.38031 7.99996 2.37898C7.85552 2.37764 7.73618 2.42498 7.64196 2.52098C7.54774 2.61698 7.5004 2.73631 7.49996 2.87898C7.49952 3.02164 7.54685 3.1412 7.64196 3.23764C7.73707 3.33409 7.8564 3.38187 7.99996 3.37964Z"
                fill="#70747E"
              />
            </svg>
          ),
        },
        {
          name: "Feedback & Support",
          path: "/dashboards/feedback",
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="my-auto"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 5.91758C4.5 4.98932 4.86875 4.09909 5.52513 3.44271C6.1815 2.78633 7.07174 2.41758 8 2.41758C8.92826 2.41758 9.8185 2.78633 10.4749 3.44271C11.1313 4.09909 11.5 4.98932 11.5 5.91758C11.5 6.05019 11.5527 6.17737 11.6464 6.27114C11.7402 6.3649 11.8674 6.41758 12 6.41758C12.1326 6.41758 12.2598 6.3649 12.3536 6.27114C12.4473 6.17737 12.5 6.05019 12.5 5.91758C12.4999 5.15015 12.3036 4.39548 11.9297 3.72531C11.5557 3.05514 11.0166 2.49174 10.3636 2.08866C9.71049 1.68558 8.9652 1.45621 8.19852 1.42235C7.43183 1.3885 6.66922 1.55128 5.98318 1.89523C5.29714 2.23918 4.71046 2.75287 4.2789 3.38747C3.84735 4.02207 3.58526 4.7565 3.51755 5.52094C3.44984 6.28538 3.57876 7.05444 3.89205 7.75501C4.20534 8.45559 4.69259 9.0644 5.3075 9.52358C5.83479 9.91747 6.44206 10.1909 7.0865 10.3246C7.17602 10.5254 7.32921 10.6911 7.52238 10.796C7.71555 10.901 7.93793 10.9394 8.15511 10.9053C8.37229 10.8711 8.57217 10.7664 8.72382 10.6072C8.87548 10.448 8.97046 10.2433 8.99406 10.0248C9.01767 9.80619 8.96859 9.58593 8.85441 9.39805C8.74024 9.21018 8.56733 9.06517 8.36245 8.98545C8.15756 8.90573 7.93212 8.89575 7.72099 8.95706C7.50987 9.01836 7.32483 9.14753 7.1945 9.32458C6.4273 9.14314 5.74382 8.70801 5.25478 8.08965C4.76574 7.4713 4.49979 6.70595 4.5 5.91758ZM5 5.91758C5.0002 5.36568 5.15264 4.82452 5.44054 4.35366C5.72845 3.88281 6.14067 3.50049 6.63184 3.24879C7.123 2.9971 7.67409 2.88577 8.22445 2.92706C8.7748 2.96835 9.3031 3.16066 9.75122 3.48283C10.1993 3.805 10.5499 4.24454 10.7643 4.75308C10.9787 5.26163 11.0487 5.81947 10.9666 6.36523C10.8844 6.91098 10.6533 7.4235 10.2987 7.84638C9.94402 8.26926 9.4796 8.58612 8.9565 8.76208C8.68749 8.53941 8.34921 8.41757 8 8.41758C7.6365 8.41758 7.3035 8.54708 7.0435 8.76208C6.44788 8.56172 5.93021 8.17937 5.56355 7.669C5.1969 7.15863 4.99978 6.546 5 5.91758ZM8 3.91758C7.46957 3.91758 6.96086 4.1283 6.58579 4.50337C6.21071 4.87844 6 5.38715 6 5.91758C6 6.44802 6.21071 6.95672 6.58579 7.3318C6.96086 7.70687 7.46957 7.91758 8 7.91758C8.53043 7.91758 9.03914 7.70687 9.41421 7.3318C9.78929 6.95672 10 6.44802 10 5.91758C10 5.38715 9.78929 4.87844 9.41421 4.50337C9.03914 4.1283 8.53043 3.91758 8 3.91758ZM3.75 9.41758H4.4295C4.83143 9.82822 5.30114 10.1665 5.818 10.4176H3.75C3.55109 10.4176 3.36032 10.4966 3.21967 10.6373C3.07902 10.7779 3 10.9687 3 11.1676V11.4176C3 12.1541 3.47 12.8921 4.3795 13.4706C5.283 14.0456 6.5615 14.4176 7.9995 14.4176C9.4385 14.4176 10.717 14.0456 11.6205 13.4706C12.5305 12.8926 13 12.1536 13 11.4176V11.1676C13 10.9687 12.921 10.7779 12.7803 10.6373C12.6397 10.4966 12.4489 10.4176 12.25 10.4176H9.415C9.52938 10.0941 9.52938 9.7411 9.415 9.41758H12.25C12.7141 9.41758 13.1592 9.60196 13.4874 9.93015C13.8156 10.2583 14 10.7035 14 11.1676V11.4176C14 12.6141 13.2385 13.6261 12.1575 14.3141C11.0705 15.0061 9.599 15.4176 8 15.4176C6.401 15.4176 4.93 15.0061 3.8425 14.3141C2.7615 13.6261 2 12.6141 2 11.4176V11.1676C2 10.7035 2.18437 10.2583 2.51256 9.93015C2.84075 9.60196 3.28587 9.41758 3.75 9.41758Z"
                fill="#70747E"
              />
            </svg>
          ),
        },
        {
          name: "Certificate",
          path: "/dashboards/student-certificate",
          icon: (
            <svg
              width="20"
              height="21"
              viewBox="0 0 20 21"
              fill="none"
              stroke="currentColor"
              className="my-auto"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.33329 2.91748C2.40829 2.91748 1.66663 3.65915 1.66663 4.58415V12.9175C1.66663 13.3595 1.84222 13.7834 2.15478 14.096C2.46734 14.4086 2.89127 14.5841 3.33329 14.5841H9.99996V18.7508L12.5 16.2508L15 18.7508V14.5841H16.6666C17.1087 14.5841 17.5326 14.4086 17.8451 14.096C18.1577 13.7834 18.3333 13.3595 18.3333 12.9175V4.58415C18.3333 4.14212 18.1577 3.7182 17.8451 3.40564C17.5326 3.09308 17.1087 2.91748 16.6666 2.91748H3.33329ZM9.99996 4.58415L12.5 6.25081L15 4.58415V7.50081L17.5 8.75081L15 10.0008V12.9175L12.5 11.2508L9.99996 12.9175V10.0008L7.49996 8.75081L9.99996 7.50081V4.58415ZM3.33329 4.58415H7.49996V6.25081H3.33329V4.58415ZM3.33329 7.91748H5.83329V9.58415H3.33329V7.91748ZM3.33329 11.2508H7.49996V12.9175H3.33329V11.2508Z"
                fill="black"
              />
            </svg>
          ),
        },
        // {
        //   name: "Logout",
        //   path: "#",
        //   icon: (
        //     <svg
        //       xmlns="http://www.w3.org/2000/svg"
        //       width="16"
        //       height="24"
        //       viewBox="0 0 24 24"
        //       fill="none"
        //       stroke="currentColor"
        //       strokeWidth="2"
        //       strokeLinecap="round"
        //       strokeLinejoin="round"
        //       className="feather feather-volume-1"
        //     >
        //       <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
        //       <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
        //     </svg>
        //   ),
        // },
        {
          name: "Payments",
          path: "/dashboards/student-payment",
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="my-auto"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clip-path="url(#clip0_91_1658)">
                <path
                  d="M7.99996 8.75098C7.38112 8.75098 6.78763 8.99681 6.35004 9.43439C5.91246 9.87198 5.66663 10.4655 5.66663 11.0843C5.66663 11.7031 5.91246 12.2966 6.35004 12.7342C6.78763 13.1718 7.38112 13.4176 7.99996 13.4176C8.6188 13.4176 9.21229 13.1718 9.64987 12.7342C10.0875 12.2966 10.3333 11.7031 10.3333 11.0843C10.3333 10.4655 10.0875 9.87198 9.64987 9.43439C9.21229 8.99681 8.6188 8.75098 7.99996 8.75098ZM6.99996 11.0843C6.99996 10.8191 7.10532 10.5647 7.29285 10.3772C7.48039 10.1897 7.73474 10.0843 7.99996 10.0843C8.26518 10.0843 8.51953 10.1897 8.70707 10.3772C8.8946 10.5647 8.99996 10.8191 8.99996 11.0843C8.99996 11.3495 8.8946 11.6039 8.70707 11.7914C8.51953 11.979 8.26518 12.0843 7.99996 12.0843C7.73474 12.0843 7.48039 11.979 7.29285 11.7914C7.10532 11.6039 6.99996 11.3495 6.99996 11.0843Z"
                  fill="black"
                />
                <path
                  d="M11.684 3.82827L9.56467 0.856934L1.772 7.08227L1.34 7.0776V7.08427H1V15.0843H15V7.08427H14.3587L13.0827 3.3516L11.684 3.82827ZM12.95 7.08427H6.26467L11.244 5.38693L12.2587 5.06227L12.95 7.08427ZM10.3667 4.2776L5.22667 6.0296L9.29733 2.7776L10.3667 4.2776ZM2.33333 12.5303V9.63693C2.61478 9.5376 2.87043 9.37654 3.08154 9.16555C3.29264 8.95456 3.45385 8.699 3.55333 8.4176H12.4467C12.5461 8.69912 12.7072 8.95481 12.9183 9.16592C13.1295 9.37703 13.3851 9.5382 13.6667 9.6376V12.5309C13.3851 12.6303 13.1295 12.7915 12.9183 13.0026C12.7072 13.2137 12.5461 13.4694 12.4467 13.7509H3.55467C3.45479 13.4694 3.29331 13.2137 3.08201 13.0025C2.87072 12.7913 2.61493 12.63 2.33333 12.5303Z"
                  fill="black"
                />
              </g>
              <defs>
                <clipPath id="clip0_91_1658">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(0 0.41748)"
                  />
                </clipPath>
              </defs>
            </svg>
          ),
        },
        {
          name: "Apply for Placement",
          path: "/dashboards/student-apply",
          icon: (
            <svg
              width="16"
              height="17"
              viewBox="0 0 16 17"
              fill="none"
              className="my-auto"
              stroke="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.5 5.91758C4.5 4.98932 4.86875 4.09909 5.52513 3.44271C6.1815 2.78633 7.07174 2.41758 8 2.41758C8.92826 2.41758 9.8185 2.78633 10.4749 3.44271C11.1313 4.09909 11.5 4.98932 11.5 5.91758C11.5 6.05019 11.5527 6.17737 11.6464 6.27114C11.7402 6.3649 11.8674 6.41758 12 6.41758C12.1326 6.41758 12.2598 6.3649 12.3536 6.27114C12.4473 6.17737 12.5 6.05019 12.5 5.91758C12.4999 5.15015 12.3036 4.39548 11.9297 3.72531C11.5557 3.05514 11.0166 2.49174 10.3636 2.08866C9.71049 1.68558 8.9652 1.45621 8.19852 1.42235C7.43183 1.3885 6.66922 1.55128 5.98318 1.89523C5.29714 2.23918 4.71046 2.75287 4.2789 3.38747C3.84735 4.02207 3.58526 4.7565 3.51755 5.52094C3.44984 6.28538 3.57876 7.05444 3.89205 7.75501C4.20534 8.45559 4.69259 9.0644 5.3075 9.52358C5.83479 9.91747 6.44206 10.1909 7.0865 10.3246C7.17602 10.5254 7.32921 10.6911 7.52238 10.796C7.71555 10.901 7.93793 10.9394 8.15511 10.9053C8.37229 10.8711 8.57217 10.7664 8.72382 10.6072C8.87548 10.448 8.97046 10.2433 8.99406 10.0248C9.01767 9.80619 8.96859 9.58593 8.85441 9.39805C8.74024 9.21018 8.56733 9.06517 8.36245 8.98545C8.15756 8.90573 7.93212 8.89575 7.72099 8.95706C7.50987 9.01836 7.32483 9.14753 7.1945 9.32458C6.4273 9.14314 5.74382 8.70801 5.25478 8.08965C4.76574 7.4713 4.49979 6.70595 4.5 5.91758ZM5 5.91758C5.0002 5.36568 5.15264 4.82452 5.44054 4.35366C5.72845 3.88281 6.14067 3.50049 6.63184 3.24879C7.123 2.9971 7.67409 2.88577 8.22445 2.92706C8.7748 2.96835 9.3031 3.16066 9.75122 3.48283C10.1993 3.805 10.5499 4.24454 10.7643 4.75308C10.9787 5.26163 11.0487 5.81947 10.9666 6.36523C10.8844 6.91098 10.6533 7.4235 10.2987 7.84638C9.94402 8.26926 9.4796 8.58612 8.9565 8.76208C8.68749 8.53941 8.34921 8.41757 8 8.41758C7.6365 8.41758 7.3035 8.54708 7.0435 8.76208C6.44788 8.56172 5.93021 8.17937 5.56355 7.669C5.1969 7.15863 4.99978 6.546 5 5.91758ZM8 3.91758C7.46957 3.91758 6.96086 4.1283 6.58579 4.50337C6.21071 4.87844 6 5.38715 6 5.91758C6 6.44802 6.21071 6.95672 6.58579 7.3318C6.96086 7.70687 7.46957 7.91758 8 7.91758C8.53043 7.91758 9.03914 7.70687 9.41421 7.3318C9.78929 6.95672 10 6.44802 10 5.91758C10 5.38715 9.78929 4.87844 9.41421 4.50337C9.03914 4.1283 8.53043 3.91758 8 3.91758ZM3.75 9.41758H4.4295C4.83143 9.82822 5.30114 10.1665 5.818 10.4176H3.75C3.55109 10.4176 3.36032 10.4966 3.21967 10.6373C3.07902 10.7779 3 10.9687 3 11.1676V11.4176C3 12.1541 3.47 12.8921 4.3795 13.4706C5.283 14.0456 6.5615 14.4176 7.9995 14.4176C9.4385 14.4176 10.717 14.0456 11.6205 13.4706C12.5305 12.8926 13 12.1536 13 11.4176V11.1676C13 10.9687 12.921 10.7779 12.7803 10.6373C12.6397 10.4966 12.4489 10.4176 12.25 10.4176H9.415C9.52938 10.0941 9.52938 9.7411 9.415 9.41758H12.25C12.7141 9.41758 13.1592 9.60196 13.4874 9.93015C13.8156 10.2583 14 10.7035 14 11.1676V11.4176C14 12.6141 13.2385 13.6261 12.1575 14.3141C11.0705 15.0061 9.599 15.4176 8 15.4176C6.401 15.4176 4.93 15.0061 3.8425 14.3141C2.7615 13.6261 2 12.6141 2 11.4176V11.1676C2 10.7035 2.18437 10.2583 2.51256 9.93015C2.84075 9.60196 3.28587 9.41758 3.75 9.41758Z"
                fill="#70747E"
              />
            </svg>
          ),
        },
      ],
    },
  ];
  const items = isAdmin
    ? adminItems
    : isInstructor
    ? instructorItems
    : studentItems;
  return (
    <div className="w-72 font-Open">
      {/* navigation menu */}
      <div className=" pt-5 2xl:pr-4 2xl:pt-5 rounded-lg2 shadow-accordion dark:shadow-accordion-dark bg-whiteColor dark:bg-whiteColor-dark h-full">
        <div className="pt-6 px-8">
          <NavbarLogo />
        </div>
        <div className="pt-4 px-8 w-[250px]">
          {/* <h2 className="text-xl text-gh font-bold mb-4">MAIN</h2> */}
        </div>
        {items?.map((item, idx) => (
          <ItemsDashboard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
