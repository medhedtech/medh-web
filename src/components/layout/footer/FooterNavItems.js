import FooterHeading from "@/components/shared/headings/FooterHeading";
import FooterNavItem from "./FooterNavItem";
import { Users, Menu, GraduationCap } from "lucide-react";

const FooterNavItems = ({ list, idx }) => {
  const { heading, items, icon } = list;
  
  // Map icon names to actual Lucide React components
  const getIcon = () => {
    const iconProps = { size: 18, className: "text-primary-400 mr-3" };
    
    switch(icon) {
      case "UserPlus":
        return <Users {...iconProps} />;
      case "Menu":
        return <Menu {...iconProps} />;
      case "GraduationCap":
        return <GraduationCap {...iconProps} />;
      default:
        return null;
    }
  };
  
  return (
    <div className="relative">
      {/* Heading with icon */}
      <div className="mb-6">
        <h3 className="font-heading text-lg font-semibold text-white flex items-center mb-2">
          {getIcon()}
          {heading}
        </h3>
        <div className="w-16 h-0.5 bg-gradient-to-r from-primary-500 to-transparent rounded-full"></div>
      </div>
      
      {/* Navigation items */}
      <ul className="space-y-3">
        {items.map(({ name, path }, idx) => (
          <FooterNavItem key={idx} path={path} name={name} />
        ))}
      </ul>
      
      {/* Decorative subtle glow effect */}
      <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary-500/5 rounded-full blur-xl opacity-30"></div>
    </div>
  );
};

export default FooterNavItems;
