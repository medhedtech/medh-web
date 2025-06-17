import { useState } from "react";
import useIsSecondary from "@/hooks/useIsSecondary";
import FooterTopLeft from "./FooterTopLeft";
import { Mail, ArrowRight } from "lucide-react";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import usePostQuery from "@/hooks/postQuery.hook";
import { apiUrls } from "@/apis";

// Validation schema
const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const FooterTop = () => {
  const { isSecondary } = useIsSecondary();
  const { postQuery } = usePostQuery();
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await postQuery({
        url: apiUrls?.Newsletter?.addNewsletter,
        postData: { email: data.email },
        onSuccess: () => {
          showToast.success("Successfully subscribed to our newsletter!");
          reset();
        },
        onFail: (err) => {
          console.error("Subscription failed:", err);
          toast.error("Error subscribing to the newsletter. Please try again!");
        },
      });
    } catch (error) {
      console.error("Error subscribing:", error);
      toast.error("Something went wrong! Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-b border-gray-800 pb-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left side content */}
        <FooterTopLeft />
        
        {/* Right side subscription form */}
        <div>
          <form onSubmit={handleSubmit(onSubmit)} className="relative">
            <div className="relative">
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400" />
              </div>
              
              <input
                type="email"
                placeholder="Enter your email address"
                className={`w-full pl-10 pr-36 py-4 bg-gray-800/50 border ${
                  errors.email ? "border-red-500" : "border-gray-700"
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200`}
                {...register("email")}
              />
              
              <button
                type="submit"
                disabled={loading}
                className="absolute right-2 top-2 bottom-2 px-4 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white font-medium rounded-md transition-all duration-300 flex items-center justify-center min-w-[120px]"
              >
                {loading ? "Sending..." : (
                  <>
                    Subscribe <ArrowRight size={16} className="ml-1.5" />
                  </>
                )}
              </button>
            </div>
            
            {errors.email && (
              <p className="text-red-400 text-xs mt-1.5 ml-3">
                {errors.email.message}
              </p>
            )}
          </form>
          
          <p className="text-gray-400 text-xs mt-3 ml-3">
            Join 25,000+ subscribers and get new courses info.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FooterTop;
