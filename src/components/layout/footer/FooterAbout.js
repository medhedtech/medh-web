import useIsSecondary from "@/hooks/useIsSecondary";
import { Clock, Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import logoImage from "@/assets/images/logo/Medh_logo.png";

const FooterAbout = () => {
  const { isSecondary } = useIsSecondary();
  
  const socialLinks = [
    {
      name: "Facebook",
      url: "https://www.facebook.com/medhupskill/",
      icon: <Facebook size={16} />
    },
    {
      name: "LinkedIn",
      url: "https://www.linkedin.com/company/101210304/admin/feed/posts/",
      icon: <Linkedin size={16} />
    },
    {
      name: "Instagram",
      url: "https://www.instagram.com/medhupskill/",
      icon: <Instagram size={16} />
    },
    {
      name: "YouTube",
      url: "https://www.youtube.com/channel/UC4EMmw69w-877_fxJExZWyw",
      icon: <Youtube size={16} />
    }
  ];
  
  return (
    <div className="sm:col-start-1 sm:col-span-12 md:col-span-6 lg:col-span-4 mb-8 lg:mb-0">
      {/* Logo */}
      <div className="mb-6">
        <Image 
          src={logoImage} 
          alt="MEDH" 
          width={150} 
          height={50} 
          className="h-10 w-auto object-contain" 
        />
      </div>
      
      {/* About Text */}
      <h4 className="text-xl font-bold text-white mb-4 flex items-center">
        <span className="w-1 h-5 bg-green-500 rounded-sm mr-3 inline-block"></span>
        About us
      </h4>
      
      <p className="text-gray-300 mb-6 leading-relaxed text-sm md:text-base">
        MEDH is a premier online education platform dedicated to helping professionals upskill and advance their careers. We offer expert-led courses in high-demand fields with personalized learning experiences.
      </p>
      
      {isSecondary ? (
        <div className="mt-6">
          <h5 className="text-sm uppercase text-gray-400 mb-3 tracking-wider">Follow us</h5>
          <div className="flex gap-3">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Visit our ${link.name} page`}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-800 hover:bg-green-600 text-gray-300 hover:text-white transition-colors duration-300"
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg p-4 flex items-center">
          <div className="mr-4 bg-green-600 rounded-full p-3 flex-shrink-0">
            <Clock size={24} className="text-white" />
          </div>
          <div>
            <h6 className="text-white font-medium mb-1">BUSINESS HOURS</h6>
            <p className="text-gray-400 text-sm">Mon - Sat (8:00 AM - 6:00 PM)</p>
            <p className="text-gray-400 text-sm">Sunday - Closed</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterAbout;
