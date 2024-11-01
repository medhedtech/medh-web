import Image from "next/image";

const CountDashboard = ({ count }) => {
  const { name, data, image, symbol } = count;
  return (
    <div className=" md:px-0 md:py-0px mt-4 flex justify-between bg-slate-900 dark:bg-whiteColor-dark rounded-3xl shadow-accordion-dark">
      <div className="flex flex-col justify-between gap-4">
        <div className="p-4">
          <Image src={image} alt="" />
        </div>
        <p className="text-white p-4 font-medium leading-[18px] dark:text-blackColor-dark">
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

export default CountDashboard;
