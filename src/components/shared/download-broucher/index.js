import { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { toast } from "react-toastify";
import { apiUrls } from "@/apis";
import usePostQuery from "@/hooks/postQuery.hook";

const DownloadBrochureModal = ({ isOpen, onClose, courseTitle }) => {
  const { postQuery, loading } = usePostQuery();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Validate the form data
    if (!formData.full_name || !formData.email || !formData.phone_number) {
      toast.error("Please fill out all fields.");
      return;
    }
    try {
      await postQuery({
        url: apiUrls?.brouchers?.addBroucher,
        postData: {
          full_name: formData.full_name,
          email: formData.email,
          phone_number: formData.phone_number,
          course_title: courseTitle || "Default Course Title",
        },
        onSuccess: () => {
          // toast.success("Brochure created and sent successfully!");
          onClose();
          setShowModal(true);
        },
        onFail: () => {
          toast.error("An error occurred while sending the brochure.");
        },
      });
    } catch (error) {
      console.error("An error occurred:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg w-100 py-6 px-4 relative">
          <div className="flex border-b-2">
            <button
              onClick={onClose}
              className="absolute font-normal top-3 text-4xl right-3 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
            <h2 className="text-xl font-Poppins font-semibold mb-4">
              Download Brochure
            </h2>
          </div>
          <h3 className="text-xl font-medium text-[#FFB547] my-4">
            Certificate Course in
            <br />
            <span className="font-bold text-2xl text-[#FFA63E]">
              {courseTitle || "Course Title"}
            </span>
          </h3>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <input
              type="text"
              name="full_name"
              placeholder="Your Name*"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Your Email*"
              className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <div className="flex space-x-2">
              <select
                className="px-4 text-black py-2 border rounded w-1/3 focus:outline-none focus:border-[#FFA63E]"
                required
              >
                <option value="IN">IN (+91)</option>
                <option value="AUS">AUS (+61)</option>
                <option value="CA">CA (+1)</option>
                <option value="SGP">SGP (+65) </option>
                <option value="UAE">UAE (+971)</option>
                <option value="UK">UK (+44) </option>
              </select>
              <input
                type="tel"
                name="phone_number"
                placeholder="Your Phone*"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:border-[#FFA63E]"
                value={formData.phone_number}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-start space-x-2 mb-12">
              <input
                type="checkbox"
                id="accept"
                className="w-4 h-4 text-[#7ECA9D] border-gray-300 rounded mt-1 focus:ring-[#7ECA9D]"
              />
              <label
                htmlFor="accept"
                className="text-sm text-gray-700 dark:text-gray-300"
              >
                By submitting this form, I accept
                <a href="terms-and-services">
                  <span className="text-[#7ECA9D] ml-1">Terms of Service</span>
                </a>{" "}
                & <br />
                <a href="privacy-policy">
                  <span className="text-[#7ECA9D]">Privacy Policy.</span>
                </a>
              </label>
            </div>

            <div className="-mb-6">
              <button
                type="submit"
                className="bg-[#7ECA9D] rounded-[2px] text-white px-6 py-2 flex items-center justify-center"
              >
                {loading ? (
                  <span>Loading...</span>
                ) : (
                  <>
                    <FaPaperPlane className="mr-2" />
                    Submit
                  </>
                )}{" "}
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative">
            {/* Close Icon */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Content */}
            <div className="text-center">
              <h2 className="text-lg md:text-[28px] font-semibold text-green-500">
                🎉 Success!
              </h2>
              <p className="text-gray-700 mt-2">
                Your form has been submitted successfully!
              </p>
              <button
                onClick={() => setShowModal(false)}
                className="mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DownloadBrochureModal;
