import HeroPrimary from "@/components/sections/hero-banners/HeroPrimary";
import LessonCourseMaterialsPrimary from "@/components/sections/lesson-course-materials/LessonCourseMaterialsPrimary";

const LessonCourseMaterialsMain = () => {
  return (
    <>
      <HeroPrimary path={"Course Materials"} title={"Course Materials"} />

      <LessonCourseMaterialsPrimary />
    </>
  );
};

export default LessonCourseMaterialsMain;
