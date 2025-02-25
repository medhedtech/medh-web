import useIsSecondary from "@/hooks/useIsSecondary";
import Image from "next/image";
import Link from "next/link";
import logoImage from "@/assets/images/logo/logo_2.png";
import { Headset } from "lucide-react";

const FooterTopLeft = () => {
  const { isSecondary } = useIsSecondary();

  return (
    <div>
      {isSecondary ? (
        <div className="flex flex-col space-y-4">
          <Link href="/" className="inline-block">
            <Image 
              src={logoImage} 
              alt="MEDH" 
              width={150} 
              height={50} 
              className="h-10 w-auto object-contain" 
            />
          </Link>
          <p className="text-gray-300 text-sm max-w-md">
            Join our newsletter to stay up to date on features and releases.
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-4">
          <div className="flex items-center">
            <div className="w-1.5 h-12 bg-green-500 rounded-sm mr-4"></div>
            <h4 className="text-2xl md:text-3xl font-bold text-white leading-tight">
              Need Help With Your <span className="text-green-500">Learning Journey</span>?
            </h4>
          </div>
          
          <p className="text-gray-300 text-sm md:text-base max-w-md leading-relaxed">
            Subscribe to our newsletter for updates on new courses, learning resources, and special offers to accelerate your career growth.
          </p>
          
          <div className="flex items-center mt-2">
            <div className="w-10 h-10 rounded-full bg-green-600/20 flex items-center justify-center mr-3">
              <Headset size={20} className="text-green-500" />
            </div>
            <div>
              <p className="text-white font-medium">Need assistance?</p>
              <a href="tel:+918888888888" className="text-green-400 hover:text-green-300 transition-colors">
                +91 888 888 8888
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterTopLeft;
