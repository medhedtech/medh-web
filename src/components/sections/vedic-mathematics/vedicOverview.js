// "use client";

// import React, { useState } from "react";

// const data = {
//   tabs: [
//     {
//       id: 1,
//       name: "Overview",
//       content:
//         "Vedic Mathematics Course offers a wide array of benefits, from simplifying complex calculations to enhancing mental agility and boosting confidence. The system&#39;s versatility and applicability across various branches of mathematics make it a valuable tool for individuals preparing for competitive exams or seeking to improve their mathematical skills. ",
//       contents:
//         "With its emphasis on simplicity, speed, and universality, Vedic Mathematics has the potential to transform the way individuals perceive and engage with mathematics, making it an essential skill for personal and professional growth.",
//     },
//     {
//       id: 2,
//       name: "Benefits",
//       content:
//         "Benefits of Vedic Mathematics include improved speed in calculations, better mental agility, and stronger problem-solving skills. It's highly beneficial for students preparing for competitive exams.",
//     },
//     {
//       id: 3,
//       name: "Career Prospects",
//       content:
//         "Vedic Mathematics provides excellent career prospects for those aiming to excel in mathematics, teaching, tutoring, and competitive exams.",
//     },
//     {
//       id: 4,
//       name: "Sutras and Sub sutras",
//       content:
//         "This section covers the fundamental principles (sutras) and detailed applications (sub-sutras) for effective problem-solving in mathematics.",
//     },
//   ],
//   overview: {
//     keyFeatures: [
//       {
//         title: "Simplicity",
//         description:
//           "Aims to simplify complex mathematical calculations through its unique techniques.",
//       },
//       {
//         title: "Speed",
//         description:
//           "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
//       },
//       {
//         title: "Versatility",
//         description:
//           "Offers multiple approaches to solve a single problem, allowing users to choose the method that suits them best.",
//       },
//       {
//         title: "Universality",
//         description:
//           "Applicable to various branches of mathematics, such as arithmetic, algebra, trigonometry, calculus, and more.",
//       },
//     ],
//   },
// };

// const PersonalityOverview = () => {
//   const [activeTab, setActiveTab] = useState(1);

//   const activeContent = data.tabs.find((tab) => tab.id === activeTab);

//   return (
//     <div className="bg-white dark:bg-screen-dark h-auto py-10 w-full flex justify-center items-center">
//       <div className="w-full md:w-[80%]">
//         {/* Title */}
//         <div className="flex items-center flex-col w-80% md:mb-20 mb-10 px-4">
//           <h1 className="text-[24px] leading-7 md:text-4xl font-bold md:mb-3 mb-2 dark:text-gray50 text-[#41454F]">
//             Welcome to Medh&#39;s Vedic Mathematics Course
//           </h1>
//           <p className="text-center md:text-[15px] text-[14px] leading-6 md:leading-7 md:w-[70%] text-[#727695] dark:text-gray300">
//             Our course is designed to simplify mathematical problems through
//             ancient techniques that can be applied to a variety of real-world
//             applications.
//           </p>
//         </div>

//         {/* Tabs */}
//         <div className="flex md:mx-0 mx-4  flex-wrap">
//           {data.tabs.map((tab) => (
//             <button
//               key={tab.id}
//               className={`px-2 md:px-6 mr-2 md:py-2 py-1 transition md:mb-0 mb-1 ${
//                 activeTab === tab.id
//                   ? "bg-primaryColor text-white font-semibold"
//                   : "bg-white text-primaryColor border border-primaryColor"
//               } hover:bg-primaryColor hover:text-white`}
//               onClick={() => setActiveTab(tab.id)}
//             >
//               {tab.name}
//             </button>
//           ))}
//         </div>

//         {/* Content Rendering */}
//         <section className="bg-white dark:text-gray300 dark:bg-screen-dark px-5 mx-4 sm:mx-0 md:px-6 py-8 border-2 border-gray300 dark:border-gray600 text-lightGrey14">
//           <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
//             {activeContent.name}
//           </h1>
//           <p className="mb-2 md:text-[15px] text-[14px] ">
//             {activeContent.content}
//           </p>
//           <p className="mb-2 md:text-[15px] text-[14px]">
//             {activeContent.contents}
//           </p>

//           {activeTab === 1 && (
//             <>
//               {/* Transformative Learning Experience */}
//               <h2 className="text-[1.3rem] font-bold mb-3 tracking-wide dark:text-gray50">
//                 Transformative Learning Experience
//               </h2>
//               <p className="mb-2 text-[14px]">
//                 In today&#39;s competitive world, the ability to solve problems
//                 quickly is crucial, and that&#39;s where Vedic Mathematics comes
//                 to your rescue. Through interactive and easy-to-follow lessons
//                 and practice exercises, you will learn powerful techniques that
//                 make math easy and enjoyable, including:
//               </p>
//               <ul className=" list-none mb-4 ">
//                 <li className="text-[14px] ml-8">
//                   <strong className="dark:text-gray50">
//                     Easy Tricks to Solve:
//                   </strong>{" "}
//                   Addition, Subtraction, Multiplication, and Division
//                 </li>
//                 <li className="text-[14px] ml-8 ">
//                   <strong className="dark:text-gray50">
//                     Fast & Accurate Calculations of:
//                   </strong>{" "}
//                   Square Root, Cube, Cube Root, HCF, LCM, and Algebra
//                 </li>
//               </ul>
//               <p className="text-[14px] mb-6">
//                 And lots of other lessons that help you fall in love with
//                 Mathematics.
//               </p>

//               {/* Key Features */}
//               <h2 className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50">
//                 Key Features of Vedic Mathematics:
//               </h2>
//               <ul className="list-none list-inside space-y-2 pb-2">
//                 {data.overview.keyFeatures.map((feature, index) => (
//                   <li key={index}>
//                     <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
//                       {feature.title}:
//                     </strong>{" "}
//                     {feature.description}
//                   </li>
//                 ))}
//               </ul>
//             </>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// };

// export default PersonalityOverview;

"use client";

import React, { useState } from "react";

const data = {
  tabs: [
    {
      id: 1,
      name: "Overview",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Vedic Mathematics Course offers a wide array of benefits, from
            simplifying complex calculations to enhancing mental agility and
            boosting confidence. The system&#39;s versatility and applicability
            across various branches of mathematics make it a valuable tool for
            individuals preparing for competitive exams or seeking to improve
            their mathematical skills.
          </p>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            With its emphasis on simplicity, speed, and universality, Vedic
            Mathematics has the potential to transform the way individuals
            perceive and engage with mathematics, making it an essential skill
            for personal and professional growth.
          </p>
          <h2 className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50 ">
            Transformative Learning Experience
          </h2>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            In today&#39;s competitive world, the ability to solve problems
            quickly is crucial, and that&#39;s where Vedic Mathematics comes to
            your rescue. Through interactive and easy-to-follow lessons and
            practice exercises, you will learn powerful techniques that make
            math easy and enjoyable, including:
          </p>
          <ul className="list-none pl-4 list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Easy Tricks to Solve",
                description:
                  "Addition, Subtraction, Multiplication, and Division",
              },
              {
                title: "Fast & Accurate Calculations of",
                description:
                  "Square Root, Cube, Cube Root, HCF, LCM, and Algebra",
              },
            ].map((feature, index) => (
              <li
                key={index}
                className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-2 before:h-[2px] before:bg-gray-400 before:border-dotted dark:before:bg-gray-300"
              >
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            And lots of other lessons that help you fall in love with
            Mathematics.
          </p>
          <h2 className="text-[1.3rem] font-bold mb-4 tracking-wide dark:text-gray50 ">
            Key Features of Vedic Mathematics
          </h2>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Simplicity",
                description:
                  "Aims to simplify complex mathematical calculations through its unique techniques.",
              },
              {
                title: "Speed",
                description:
                  "Methods are designed to expedite calculations, making them helpful for mental math and quick problem-solving.",
              },
              {
                title: "Versatility",
                description:
                  "Offers multiple approaches to solve a single problem, allowing users to choose the method that suits them best.",
              },
              {
                title: "Universality",
                description:
                  "Applicable to various branches of mathematics, such as arithmetic, algebra, trigonometry, calculus, and more.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },
    {
      id: 2,
      name: "Benefits",
      content: (
        <>
          <ul className="list-none list-inside space-y-2 pb-2 dark:text-gray300">
            {[
              {
                title: "Speed and Efficiency",
                description:
                  "Provides mental calculation techniques for complex calculations, particularly useful in competitive exams.",
              },
              {
                title: "Flexibility",
                description:
                  "Offers multiple approaches to solving a single problem, making it a versatile system.",
              },
              {
                title: "Simplicity and Ease of Learning",
                description:
                  "Designed to be concise and easy to remember, making it accessible to learners of various ages and mathematical backgrounds.",
              },
              {
                title: "Mental Calculation Skills",
                description:
                  "Emphasizes mental calculation techniques, which help improve overall mental math abilities.",
              },

              {
                title: "Enhances Mathematical Aptitude",
                description:
                  "Leads to a deeper understanding of mathematical concepts and enhances problem-solving skills.",
              },
              {
                title: "Universal Applicability",
                description:
                  "Principles can be applied across various mathematical disciplines.",
              },
              {
                title: "Cognitive Benefits",
                description:
                  "Improves concentration, memory, and mental agility, as well as encourages creative thinking.",
              },
              {
                title: "Fun and Engaging",
                description:
                  "Makes mathematics an enjoyable and engaging subject to learn.",
              },

              {
                title: "Cultural and Historical Value",
                description:
                  "Provides a link to the rich cultural heritage of India.",
              },
              {
                title: "Competitive Aptitude",
                description:
                  "Develops critical thinking, time management, and problem-solving abilities.",
              },
              {
                title: "Nurtures Both Sides of the Brain",
                description:
                  "Cultivates the development of both the left and right hemispheres of the brain.",
              },
            ].map((feature, index) => (
              <li key={index}>
                <strong className="text-[1rem] font-bold tracking-wide dark:text-gray50">
                  {feature.title}:
                </strong>{" "}
                {feature.description}
              </li>
            ))}
          </ul>
        </>
      ),
    },

    {
      id: 3,
      name: "Career Prospects",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300">
            While the Vedic Math course is not explicitly tailored for career
            purposes, enhancing your math skills through this course can prove
            beneficial in a wide range of fields, including engineering,
            finance, data analysis, teaching, research, and entrepreneurial
            ventures.
          </p>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300">
            The speed, accuracy, and problem-solving abilities gained through
            Vedic Mathematics can provide a competitive edge in various career
            paths and academic pursuits.
          </p>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300">
            Additionally, the cross-disciplinary applications of Vedic
            Mathematics extend to fields like computer science, artificial
            intelligence, cryptography, and more, making it a valuable asset in
            various domains where rapid calculations and optimization are
            essential.
          </p>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300">
            Whether it&#39;s gaining a competitive edge in exams, venturing into
            academia, or exploring entrepreneurial endeavors, the benefits of
            Vedic Mathematics transcend traditional career boundaries,
            presenting an array of possibilities for individuals seeking to
            leverage their mathematical prowess.
          </p>
        </>
      ),
    },
    {
      id: 4,
      name: "Sutras and Sub-sutras",
      content: (
        <>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Vedic Mathematics is based on a set of 16 main sutras (aphorisms)
            and 12 sub-sutras (corollaries). These sutras and sub-sutras are
            short and concise rules or principles that serve as the foundation
            for various mathematical operations. They provide a systematic and
            efficient way to perform calculations mentally.
          </p>
          <div className="overflow-x-auto">
          <table className="table-auto border-collapse border border-gray-300 w-full text-center text-[#41454F] dark:text-gray50 my-6">
          {/* <table className="table-auto border-collapse border border-gray-300 w-full text-center text-[#41454F] dark:text-gray50 my-6"> */}
            {/* <thead> */}
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                {/* <th className="border border-gray-300 px-4 py-2 font-bold"> */}
                <th className="border border-gray-300 px-4 py-2 font-bold text-sm md:text-base">
                  Main Sutras (aphorisms)
                </th>
                {/* <th className="border border-gray-300 px-4 py-2 font-bold"> */}
                <th className="border border-gray-300 px-4 py-2 font-bold text-sm md:text-base">
                  Sub-Sutras (corollaries)
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-100 dark:hover:bg-gray-800">
                <td className="border border-gray-300 px-4 py-2">
                  {/* <tr>
                <td className="border border-gray-300 px-4 py-2"> */}
                  <div className="font-bold">Ekādhikena Purvena</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By one more than the previous one.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Antyayor Dasakepi.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The last digit of the sum of the last terms.
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">
                    Nikhilam Navatashcaramam Dashatah.
                  </div>
                  <div className=" text-[#727695] dark:text-gray300">
                    All from 9 and the last from 10.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Antyayor Niyamah.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Only the last terms.
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Urdhva-Tiryagbhyam.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Vertically and crosswise.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Adyamādyenantyamantyena.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The first by the first and the last by the last.
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Parāvartya Yojayet.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Transpose and adjust.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Yāvadūnena Vargānām</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Whatever the extent of the square.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Shunyam Saamyasamuccaye.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    When the sum is the same, that sum is zero.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Lopanasthāpanabhyām.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By alternately less and more.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Anurūpyena</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Proportionately.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Vilokanam.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By mere observation.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Shesanyādiyamantyamāntyena.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The remainders by the last digit.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Gatāvakāśe Dvayena.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    In the case of duplexes, twice the number.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Sankalana-vyavakalana.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By addition and by subtraction.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Gunitasamuchyah.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The product of the sum.
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Puranāpūranābhyām.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By the completion or non-completion.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Dhvajanka.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Flag method.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Chalana-Kalanābyhām.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Differences and Similarities.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Antyayoreva.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Only the last terms.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Yaavadūnam</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Whatever the extent of its deficiency.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Yāvadūnam Tāvadūnam.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The first by the first and the last by the last.
                  </div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Vyāshtisamanstih</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    Part and Whole.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Antyayorsamāsutih</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The sum of the last terms.
                  </div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Sheshtasamucchayah</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The remainders by the last digit.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold"></div>
                  <div></div>
                </td>
              </tr>

              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Sopaantyadvayamantyam</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    The ultimate and twice the penultimate.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold"></div>
                  <div></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Ekanyūnena.</div>
                  <div className=" text-[#727695] dark:text-gray300">
                    By one less than the one before.
                  </div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold text-gray-300"></div>
                  <div></div>
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold">Gunitasamuchyah.</div>
                  <div>The product of the sum.</div>
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="font-bold"></div>
                  <div></div>
                </td>
              </tr>
            </tbody>
          </table>
          </div>
          <p className="text-lightGrey14 mb-6 md:text-[15px] text-[14px] dark:text-gray300 ">
            Vedic Mathematics core principles, represented by these sutras and
            sub-sutras, enable fast and efficient mental calculations for
            various mathematical operations such as addition, subtraction,
            multiplication, division, squaring, square roots, cube roots, and
            more. Mastering these enhances mental calculation skills and offers
            efficient methods for problem-solving.
          </p>
        </>
      ),
    },
  ],
};

const PersonalityOverview = () => {
  const [activeTab, setActiveTab] = useState(1);

  const activeContent = data.tabs.find((tab) => tab.id === activeTab);

  return (
    <div className="bg-white dark:bg-screen-dark h-auto py-10  w-full flex justify-center items-center">
      <div className="w-full md:w-[80%]">
        <div className="flex items-center flex-col w-80% md:mb-6 mb-10 px-4">
          <h1 className="text-[24px] text-center leading-7 md:text-4xl font-bold md:mb-3 mb-2 dark:text-gray50 text-[#41454F]">
            Unlock the Potential of Vedic Mathematics with Medh and Experience
            its Transformative Magic!
          </h1>
          <p className="text-center md:text-[18px] text-[14px] leading-6 md:leading-8 md:w-[90%] text-[#727695] dark:text-gray300">
            An ancient system deeply rooted in the sacred texts of India known
            as the Vedas. The term “Veda,” meaning knowledge, reflects the
            endless pursuit of learning and discovery.
          </p>
          <p className="text-center py-4 md:text-[18px] text-[14px] leading-6 md:leading-8 md:w-[80%] text-[#727695] dark:text-gray300">
            At MEDH, the Vedic Mathematics course is tailored to revolutionize
            math problem-solving, aiming to unleash your inner mathematician. It
            offers a holistic approach to conquer math anxiety and embrace the
            beauty of mathematics.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex md:mx-0 mx-4 space-x-2 flex-wrap">
          {data.tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-1 md:px-6 md:py-2 py-1  transition sm:mb-0 mb-1 ${
                activeTab === tab.id
                  ? "bg-primaryColor text-white font-semibold"
                  : "bg-white text-primaryColor border border-primaryColor"
              } hover:bg-primaryColor hover:text-white`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.name}
            </button>
          ))}
        </div>

        {/* Content Rendering */}
        <section className=" bg-white mx-4 md:mx-0 dark:bg-screen-dark px-2 md:px-6 py-8 border-2 border-gray-200 text-lightGrey14">
          <h1 className="text-[23px] font-bold text-primaryColor dark:text-gray50">
            {activeContent.name}
          </h1>
          <div className="mt-4">{activeContent.content}</div>
        </section>
      </div>
    </div>
  );
};

export default PersonalityOverview;
