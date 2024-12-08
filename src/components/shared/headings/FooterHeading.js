const FooterHeading = ({ children }) => {
  return (
    <h4 className="text-size-21 leading-6 font-bold  mb-3 text-white relative  after:transition-all after:duration-300 after:w-0 after:h-2px after:absolute after:bg-primaryColor hover:after:w-[30%] after:bottom-0 after:left-0 cursor-pointer">
      {children}
    </h4>
  );
};

export default FooterHeading;
