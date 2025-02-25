import FooterHeading from "@/components/shared/headings/FooterHeading";
import FooterNavItem from "./FooterNavItem";

const FooterNavItems = ({ list, idx }) => {
  const { heading, items } = list;
  
  return (
    <div
      className={`${
        idx === 0
          ? "lg:col-start-5 lg:col-span-2"
          : "lg:col-start-7 lg:col-span-3"
      } sm:col-span-6 md:col-span-3 mb-8 lg:mb-0`}
    >
      <div className="mb-5">
        <FooterHeading>{heading}</FooterHeading>
        <div className="mt-1 w-12 h-0.5 bg-gradient-to-r from-green-500 to-transparent rounded-full"></div>
      </div>
      
      <ul className="space-y-1">
        {items.map(({ name, path }, idx) => (
          <FooterNavItem key={idx} path={path} name={name} />
        ))}
      </ul>
    </div>
  );
};

export default FooterNavItems;
