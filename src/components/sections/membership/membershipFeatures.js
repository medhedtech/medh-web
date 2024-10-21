import React from 'react';
import Image from 'next/image';
import Symbol1 from "@/assets/images/membership/Symbol-1.svg"
import Symbol2 from "@/assets/images/membership/Symbol-2.svg"
import Symbol3 from "@/assets/images/membership/Symbol-3.svg"
import Symbol4 from "@/assets/images/membership/Symbol-4.svg"
import Symbol5 from "@/assets/images/membership/Symbol-5.svg"
import Symbol6 from "@/assets/images/membership/Symbol-6.svg"

const MembershipFeatures = () => {
  const features = [
    {
      title: "Program Selection and Design",
      description: "We offer a wide array of programs, carefully curated to cater to various skill levels and industries. Our programs are designed by a team of experts, considering market trends, industry demands, and emerging technologies.",
      icon: Symbol1, // You can replace these with icons if you have them
    },
    {
      title: "Interactive Learning Environment",
      description: "Our platform features multimedia content, quizzes, assignments, and Live Interactive Sessions with our Educators for doubt clearance and mentorship. This fosters active engagement, collaboration, and hands-on application of skills.",
      icon: Symbol2,
    },
    {
      title: "Experienced Educators",
      description: "Our programs are curated by experienced instructors who bring a wealth of knowledge and practical experience to the table. They provide guidance, answer queries, and facilitate discussions to enhance the learning experience.",
      icon: Symbol3,
    },
    {
      title: "Continuous Support and Feedback",
      description: "Throughout the course, we provide ongoing support, feedback, and guidance to ensure learners are on the right track. We believe in a collaborative learning experience and encourage peer-to-peer interactions.",
      icon: Symbol4,
    },
    {
      title: "Industry-Relevant Certifications",
      description: "Upon successful completion of a program, learners receive a certificate that is recognized by industry professionals. This certification serves as a testament to their acquired skills and boosts their career prospects.",
      icon: Symbol5,
    },
    {
      title: "Community Engagement",
      description: "Our platform facilitates a vibrant community where learners can network, share experiences, and collaborate on projects. We believe in building a strong professional network for our learners, helping them to thrive in their careers.",
      icon: Symbol6,
    },
  ];

  return (
    <div className="flex  items-center justify-center py-10 lg:bg-[#F3F6FB] bg-white ">
      <div className='lg:w-[80%] w-[90%] flex flex-col items-center justify-between '>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6  ">
        {features.map((feature, index) => (
          <div key={index} className="border rounded-2xl shadow-box-custom p-8 bg-white border-gray-400 ">
            <div className="flex items-center justify-center mb-5">
              <Image src={feature.icon} width={70}/>
            </div>
            <h2 className="text-[19px] leading-6  font-semibold text-center mb-3">{feature.title}</h2>
            <p className="text-[15px] leading-7 text-gray-600 text-center">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
      </div>
    </div>
  );
};

export default MembershipFeatures;
