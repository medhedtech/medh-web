import React from "react";

const benefitsData = [
  {
    title: "Impactful Work",
    description:
      "As an educator, you have the opportunity to make a significant impact on the lives of students and learners worldwide. Your expertise and teaching can reach a broader audience, transcending geographical boundaries.",
  },
  {
    title: "Leveraging Technology",
    description:
      "Join us to leverage advanced technologies for an enhanced learning experience. Stay at the forefront of educational innovation, with interactive content, AI-driven adaptive learning, and personalized teaching.",
  },
  {
    title: "Flexibility & Remote Work",
    description:
      "We offer flexible work arrangements, including the option to work remotely. This can provide you with a better work-life balance and the freedom to manage your schedule.",
  },
  {
    title: "Diverse Audience and Subjects",
    description:
      "We cater to a wide range of subjects and learners of all ages. This diversity allows you to teach a subject you are passionate about and connect with learners from various cultural backgrounds.",
  },
  {
    title: "Continuous Learning and Growth",
    description:
      "Working in EdTech exposes you to a dynamic and evolving industry. You'll have opportunities for professional development, training, and gaining new skills to improve your teaching abilities.",
  },
  {
    title: "Global Reach",
    description:
      "As part of Medh EdTech, you can reach students from different parts of the world, creating a truly global classroom. This international exposure can broaden your perspective and enrich your teaching methods.",
  },
  {
    title: "Community and Collaboration",
    description:
      "We foster a supportive community of educators. Collaborating with like-minded professionals can be inspiring, and you can share ideas and best practices with colleagues from diverse backgrounds.",
  },
  {
    title: "Data-Driven Insights",
    description:
      "We use data analytics to track student progress and performance. This data-driven approach can help you identify individual learning needs and tailor your teaching to optimize learning outcomes.",
  },
  {
    title: "Innovation and Creativity",
    description:
      "We encourage creativity in teaching. You can experiment with different teaching strategies, create interactive content, and use multimedia to make learning engaging and enjoyable.",
  },
];

// Earning Potential Data
const earningPotentialData = [
  {
    title: "Excellent Earning Potential",
    description:
      "Depending on your expertise, you will have the opportunity to earn a very good income as well as incentives to recognize and appreciate your contributions to the growth of our educational community.",
  },
  {
    title: "Job Stability and Growth",
    description:
      "With the increasing adoption of remote learning, joining us offers job stability and potential career growth with access to a wide range of professional development opportunities, workshops, and training sessions.",
  },
];

const Benefits = () => {
  return (
    <section className="py-16 w-full bg-whit dark:bg-screen-dark flex justify-center items-center">
      <div className="w-[92%] lg:w-[80%]">
        {/* Benefits Section */}
        <div className="text-center px-3 lg:px-15">
          <h2 className="text-3xl font-bold text-primaryColor">Benefits</h2>
          <p className="mt-4 text-gray-600 text-[15px] leading-7 dark:text-gray300">
            Embark on an exhilarating journey of knowledge sharing, empowerment,
            and personal growth as an educator with Medh EdTech. Our platform
            offers a gratifying and fulfilling career choice for various
            compelling reasons:
          </p>
        </div>

        {/* Render the General Benefits */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              className="px-4 pb-6 pt-8 bg-white rounded-3xl border border-[#0000004D] dark:border-gray600 shadow-card-custom w-full transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105 dark:bg-inherit "
            >
              <h3 className="text-[20px] leading-6 font-bold text-[#252525] dark:text-gray300 mb-4">
                {benefit.title}
              </h3>
              <p className="text-[#727695] text-[14px] dark:text-gray50 leading-7 pt-1">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

        {/* Earning Potential Section */}
        <div className="mt-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-6">
            {earningPotentialData.map((item, index) => (
              <div
                key={index}
                className="w-full px-4 py-8 bg-white dark:bg-inherit shadow-card-custom rounded-2xl border dark:border-gray600 border-[#0000004D] flex flex-col transition-transform duration-300 ease-in-out hover:shadow-lg hover:scale-105"
              >
                <h3 className="text-[20px] leading-6 font-bold text-[#252525] dark:text-gray50 mb-4">
                  {item.title}
                </h3>
                <p className="text-[#727695] text-[14px] dark:text-gray300 leading-7 pt-1 flex-grow">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
