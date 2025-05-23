import NetworkingIcon from "@/assets/images/icon/NetworkingIcon";
import RecognizedIcon from "@/assets/images/icon/RecognizedIcon";
import RelevantIcon from "@/assets/images/icon/RelevantIcon";
import PageWrapper from "@/components/shared/wrappers/PageWrapper";
import coursesBg from "@/assets/images/courses/coursesBg.png";
import Image from "next/image";
import CoursesFilter from "@/components/sections/courses/CoursesFilter";
import JoinMedh from "@/components/sections/hire/JoinMedh";


export const metadata = {
  title: "Courses | Medh - Education LMS Template",
  description: "Courses | Medh - Education LMS Template",
};

const Courses = async () => {
  return (
    <PageWrapper>
      <main className="w-full overflow-x-hidden">
        {/* Hero Section */}
        <div className="relative w-full h-[700px] md:h-[500px]">
          {/* Background Image */}
          <Image
            src={coursesBg}
            alt="Courses Background"
            layout="fill"
            objectFit="cover"
            className="absolute top-0 left-0 w-full h-full z-0 md:block hidden"
          />

          {/* Text Above Feature Cards */}
          <div className="absolute top-[3%] md:top-[30%] w-full text-center z-10 px-4">
            <p className="sm:text-white text-[#1f2937] text-xl md:text-size-38 font-bold leading-normal sm:leading-[45px] bg-opacity-50 inline-block py-2 md:px-4 rounded-lg">
              Accelerate Your Personal and Professional Growth with <br />{" "}
              <span className="text-[#F6B335]">
                Medh&#39;s Skill Development Courses
              </span>
            </p>
          </div>

          {/* Features Grid */}
          <div className="absolute top-[20%] md:top-[60%] left-1/2 transform -translate-x-1/2 w-full flex items-center justify-center z-10">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-7xl px-6 md:px-16">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-screen-dark p-6 shadow-lg text-center rounded-lg border-2">
                <div className="flex justify-center">
                  <RelevantIcon stroke="#F6B335" fill="#F6B335" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 dark:text-gray50">
                  Industry-Relevant Skills
                </h3>
                <p className="text-gray-600 mt-2 dark:text-gray300">
                  Designed in collaboration with industry experts, ensuring that
                  students acquire practical, up-to-date skills for their
                  desired career paths.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-6 dark:bg-screen-dark shadow-lg text-center rounded-lg border-2">
                <div className="flex justify-center">
                  <RecognizedIcon stroke="#F6B335" fill="#F6B335" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 dark:text-gray50">
                  Industry-Recognized Certifications
                </h3>
                <p className="text-gray-600 mt-2 dark:text-gray300">
                  Offer industry-recognized certifications upon completion,
                  adding credibility to the student&#39;s skillset and enhancing
                  their professional profile.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-6 dark:bg-screen-dark shadow-lg text-center rounded-lg border-2">
                <div className="flex justify-center">
                  <NetworkingIcon stroke="#7ECA9D" fill="#7ECA9D" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mt-4 dark:text-gray50">
                  Networking Opportunities
                </h3>
                <p className="text-gray-600 mt-2 dark:text-gray300">
                  Provide opportunities for students to connect with industry
                  professionals, mentors, and fellow learners, fostering
                  valuable collaboration.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="w-full lg:mt-44 mt-[31rem] md:mt-64 px-4">
          <h1 className="text-2xl md:text-3xl dark:text-gray-50 leading-8 md:leading-10 text-center font-bold py-6">
            Experience the transformative impact of MEDH&#39;s skill development
            courses.
          </h1>
          <p className="text-[#5C6574] dark:text-gray-200 text-base md:text-lg text-center pb-10">
            Our skill development programs are designed for people of all ages
            and stages of life. Whether you&#39;re a young learner, a working
            <br className="hidden md:block" />
            professional, or managing a home, our programs are carefully crafted
            to bring you joy
            <br className="hidden md:block" />
            and value, giving you an edge in today&#39;s changing world.
          </p>
        </div>

        {/* Courses Filter Section - Full Width */}
        <section className="w-full">
          <CoursesFilter 
            CustomText="Skill Development Courses"
            CustomButton={
              <div className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md">
                Explore All Courses
              </div>
            }
            description="Explore our comprehensive range of skill development courses designed to enhance your personal and professional capabilities."
          />
        </section>

        {/* Join Medh Section - Full Width */}
        <section className="w-full">
          <JoinMedh />
        </section>
      </main>

      {/* Theme Controller */}
      <div className="fixed bottom-4 left-4 z-50">
        
      </div>
    </PageWrapper>
  );
};

export default Courses;
