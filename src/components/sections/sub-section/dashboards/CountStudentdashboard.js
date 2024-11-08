import Image from "next/image";
import React from "react";

const CountStudentdashboard = ({ count }) => {
  const { name, data, image, symbol } = count;
  return (
    <div className="md:px-0 md:py-0px flex justify-between bg-gradient-to-r from-green-950 to-slate-900 dark:bg-whiteColor-dark rounded-3xl shadow-accordion-dark hover:bg-customGreen">
      <div className="flex flex-col justify-between gap-4 ">
        <div className="p-4">
          <Image src={image} alt="" />
        </div>
        <p className=" p-4 font-medium leading-[18px] text-white dark:text-white">
          {name}
        </p>
      </div>
      <div>
        <h3 className="text-size-34 leading-[1.1] text-white font-bold font-hind px-4 py-3 dark:text-blackColor-dark">
          <span data-countup-number={data}> {data}</span>
          {symbol ? <span>{symbol}</span> : ""}
        </h3>
      </div>
    </div>
  );
};

export default CountStudentdashboard;
