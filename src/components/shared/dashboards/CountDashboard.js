// import Image from "next/image";

// const CountDashboard = ({ count }) => {
//   const { name, data, image, symbol } = count;
//   return (
//     <div className="md:px-0 md:py-0px flex justify-between  dark:bg-whiteColor-dark rounded-3xl shadow-accordion-dark hover:bg-customGreen">
//       <div className="flex flex-col justify-between gap-4 ">
//         <div className="p-4">
//           <Image src={image} alt="" />
//         </div>
//         <p className=" p-4 font-medium leading-[18px] text-black dark:text-white">
//           {name}
//         </p>
//       </div>
//       <div>
//         <h3 className="text-size-34 leading-[1.1] text-black font-bold font-hind px-4 py-3 dark:text-blackColor-dark">
//           <span data-countup-number={data}> {data}</span>
//           {symbol ? <span>{symbol}</span> : ""}
//         </h3>
//       </div>
//     </div>
//   );
// };

// export default CountDashboard;
import Image from "next/image";

const CountDashboard = ({ count }) => {
  const { name, data, image, symbol } = count;

  return (
    <div className="group flex flex-col justify-between p-4 py-8 bg-white dark:bg-whiteColor-dark rounded-lg shadow-md hover:bg-customGreen transition-all ease-in-out duration-300 h-40">
      {/* Title at the top left with hover color change */}
      <p className="text-[1rem] font-medium text-black dark:text-white mb-4 group-hover:text-white">
        {name}
      </p>

      <div className="flex items-center">
        {/* Image on the left with hover color change */}
        <div className="flex items-center justify-center w-16 h-16 bg-transparant rounded-full mr-4 group-hover:bg-white">
          <Image src={image} alt="" width={30} height={36} style={{objectFit:"cover"}} />
        </div>

        {/* Count on the right side of the image with hover color change */}
        <h3 className="text-4xl font-bold text-black dark:text-blackColor-dark group-hover:text-white">
          <span data-countup-number={data}>{data}</span>
          {symbol && <span>{symbol}</span>}
        </h3>
      </div>
    </div>
  );
};

export default CountDashboard;
