import React from 'react'
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import CourseEducation from '@/components/sections/course-detailed/courseEducation'
import AboutProgram from '@/components/sections/course-detailed/aboutProgram'
import CaurseFaq from '@/components/sections/course-detailed/caurseFaq'
import CourseCertificate from '@/components/sections/course-detailed/courseCertificate'
import CourceRalated from '@/components/sections/course-detailed/courseRelated'
import ThemeController from "@/components/shared/others/ThemeController";

function CourseDetailed() {
  return (
    <PageWrapper>
        <CourseEducation/>
        <AboutProgram/>
        <CaurseFaq/>
        <CourceRalated/>
        <CourseCertificate/>
        <ThemeController/>
        </PageWrapper>
    
  )
}

export default CourseDetailed
