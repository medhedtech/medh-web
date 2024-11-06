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
      title: " WELCOME, MICLE OBEMA",
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
          name: "My Courses",
          path: "/dashboards/my-courses",
          icon: (
            <svg
              width="16"
              height="15"
              viewBox="0 0 16 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4.34269 0.750977C3.47336 0.836977 2.88803 1.03031 2.45069 1.46831C1.66736 2.25298 1.66736 3.51631 1.66736 6.04364V8.72364C1.66736 11.2503 1.66736 12.5143 2.45069 13.2996C3.23403 14.085 4.49536 14.0843 7.01736 14.0843H8.35536C10.8774 14.0843 12.1387 14.0843 12.922 13.2996C13.6334 12.5863 13.6994 11.4883 13.7054 9.40231"
                stroke="#70747E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7.01731 4.08426L7.68597 6.41759C8.05931 7.15759 8.52797 7.35092 9.69264 7.41759C10.6186 7.39492 11.156 7.28559 11.6146 6.88692C11.9273 6.61492 12.0686 6.20492 12.1373 5.79692L12.3666 4.41759M14.0386 3.08426V6.41759M5.73397 2.70626C6.79197 1.82826 7.73464 1.35692 9.68997 0.838257C9.91056 0.780018 10.1426 0.781168 10.3626 0.841591C12.0933 1.31759 13.028 1.74026 14.28 2.68026C14.3333 2.72026 14.3493 2.79492 14.312 2.85026C13.9033 3.45159 12.9906 3.93892 10.752 4.80692C10.2857 4.98634 9.76891 4.98349 9.30464 4.79892C6.92064 3.85226 5.82464 3.34559 5.69131 2.81959C5.68697 2.7986 5.68868 2.77681 5.69623 2.75675C5.70378 2.73669 5.71687 2.71918 5.73397 2.70626Z"
                stroke="#70747E"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          ),
        },
        {
          name: "Message",
          path: "/dashboards/admin-message",
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
          name: "Courses",
          path: "/dashboards/admin-course",
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
          path: "/dashboards/admin-reviews",
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
                  width="16"
                  height="17"
                  viewBox="0 0 16 17"
                  fill="none"
                  stroke="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                  className="my-auto"
                >
                  <path
                    d="M8 4.5C4 4.5 1 8.5 1 8.5s3 4 7 4 7-4 7-4-3-4-7-4z"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="8"
                    cy="8.5"
                    r="1.5"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
          ],
        },

        {
          name: "Quiz Attempts",
          path: "/dashboards/admin-quiz-attempts",
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
      ],
    },
    {
      title: "USER",
      items: [
        {
          name: "Settings",
          path: "/dashboards/admin-settings",
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
          path: "/dashboards/student-quize",
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
        {
          name: "Payments",
          path: "#",
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
          path: "#",
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
    <div className="w-72 ">
      {/* navigation menu */}
      <div className=" pt-5 2xl:pr-4 2xl:pt-5 rounded-lg2 shadow-accordion dark:shadow-accordion-dark bg-whiteColor dark:bg-whiteColor-dark h-full">
        <div className="pt-6 px-8">
          <NavbarLogo />
        </div>
        {items?.map((item, idx) => (
          <ItemsDashboard key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

export default SidebarDashboard;
