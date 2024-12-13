const HeadingLg = ({ children, color }) => {
  return (
    <div>
      {/* <h1 className="text-[#7ECA9D] text-[38px] font-bold leading-none w-full"
      > */}
      <h1 className="text-[#7ECA9D] text-[2.9rem] font-bold leading-tight tracking-normal w-full">
        {children}
      </h1>
    </div>
  );
};

export default HeadingLg;
