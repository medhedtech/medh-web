import { apiUrls } from "@/apis";
import Preloader from "@/components/shared/others/Preloader";
import usePostQuery from "@/hooks/postQuery.hook";
import { X } from "lucide-react";
import React, { useState } from "react";

const ResourceUploadModal = ({
  onClose,
  resourceVideos,
  setResourceVideos,
  resourcePdfs,
  setResourcePdfs,
}) => {
  const { postQuery, loading } = usePostQuery();
  const canProceed =
    !loading && (resourceVideos.length > 0 || resourcePdfs.length > 0);

  const handleVideoUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const updatedVideos = [...resourceVideos];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result.split(",")[1];
            const postData = { base64String: base64, fileType: "video" };

            await postQuery({
              url: apiUrls?.upload?.uploadMedia,
              postData,
              onSuccess: (data) => {
                console.log("Video uploaded successfully:", data?.data);
                updatedVideos.push(data?.data); // Append to the array
                setResourceVideos([...updatedVideos]); // Update the state
              },
              onError: (error) => {
                showToast.error("Video upload failed. Please try again.");
                console.error("Upload error:", error);
              },
            });
          };
        }
      } catch (error) {
        console.error("Error uploading video:", error);
      }
    }
  };

  const handlePdfUpload = async (e) => {
    const files = e.target.files;
    if (files.length > 0) {
      try {
        const updatedPdfs = [...resourcePdfs];
        for (const file of files) {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64 = reader.result;
            const postData = { base64String: base64 };

            await postQuery({
              url: apiUrls?.upload?.uploadDocument,
              postData,
              onSuccess: (data) => {
                console.log("PDF uploaded successfully:", data?.data);
                updatedPdfs.push(data?.data); // Append to the array
                setResourcePdfs([...updatedPdfs]); // Update the state
              },
              onError: (error) => {
                showToast.error("PDF upload failed. Please try again.");
                console.error("Upload error:", error);
              },
            });
          };
        }
      } catch (error) {
        console.error("Error uploading PDF:", error);
      }
    }
  };

  const handleProceed = () => {
    console.log("Uploaded Resources: ", {
      videos: resourceVideos,
      pdfs: resourcePdfs,
    });
    console.log("Closed");
    onClose();
  };

  const removeVideo = (index) => {
    const updatedVideos = [...resourceVideos];
    updatedVideos.splice(index, 1);
    setResourceVideos(updatedVideos);
  };

  const removePdf = (index) => {
    setResourcePdfs((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 py-6">
        <div
          className="fixed inset-0 bg-black bg-opacity-30"
          onClick={onClose}
        />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-h-[600px] max-w-lg flex flex-col">
          {loading ? (
            <div className="min-h-[300px] min-w-lg overflow-hidden">
              <Preloader />
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Upload Resources</h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 p-6 overflow-hidden flex flex-col">
                <div className="flex justify-evenly">
                  <div>
                    <p className="font-semibold mb-2 text-center text-[16px]">
                      Add Course Videos
                    </p>
                    <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[180px] h-[140px] text-center relative">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-2 mx-auto"
                      >
                        <path
                          d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                          fill="#808080"
                        />
                      </svg>
                      <p className="text-customGreen cursor-pointer text-sm">
                        Click to upload
                      </p>
                      <p className="text-gray-400 text-xs">
                        or drag & drop the files
                      </p>
                      <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="absolute inset-0 opacity-0 dark:bg-inherit cursor-pointer"
                        onChange={handleVideoUpload}
                      />
                      {resourceVideos && resourceVideos.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                      )}
                    </div>

                    {/* Uploaded Course Videos */}
                    <div className="w-[210px] text-center relative">
                      {resourceVideos.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resourceVideos.map((fileUrl, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                            >
                              <span className="truncate text-[#5C5C5C] max-w-[150px]">
                                Resource Video {index + 1}
                              </span>
                              <button
                                onClick={() => removeVideo(index)}
                                className="ml-2 text-[20px] text-[#5C5C5C] hover:text-red-700"
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="font-semibold mb-2 text-center text-[16px]">
                      Add Resource PDF&#39;s
                    </p>
                    <div className="border-dashed border-2 dark:bg-inherit bg-purple border-gray-300 rounded-lg p-3 w-[180px] h-[140px] text-center relative">
                      <svg
                        width="36"
                        height="36"
                        viewBox="0 0 48 48"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-2 mx-auto"
                      >
                        <path
                          d="M8 40C6.9 40 5.95867 39.6087 5.176 38.826C4.39333 38.0433 4.00133 37.1013 4 36V22C4.86667 22.6667 5.81667 23.1667 6.85 23.5C7.88333 23.8333 8.93333 24 10 24C12.7667 24 15.1253 23.0247 17.076 21.074C19.0267 19.1233 20.0013 16.7653 20 14C20 12.9333 19.8333 11.8833 19.5 10.85C19.1667 9.81667 18.6667 8.86667 18 8H32C33.1 8 34.042 8.392 34.826 9.176C35.61 9.96 36.0013 10.9013 36 12V21L44 13V35L36 27V36C36 37.1 35.6087 38.042 34.826 38.826C34.0433 39.61 33.1013 40.0013 32 40H8ZM8 20V16H4V12H8V8H12V12H16V16H12V20H8ZM10 32H30L23.25 23L18 30L14.75 25.65L10 32Z"
                          fill="#808080"
                        />
                      </svg>
                      <p className="text-customGreen cursor-pointer text-sm">
                        Click to upload
                      </p>
                      <p className="text-gray-400 text-xs">
                        or drag & drop the files
                      </p>
                      <input
                        type="file"
                        multiple
                        accept=".pdf"
                        className="absolute inset-0 opacity-0 cursor-pointer"
                        onChange={handlePdfUpload}
                      />
                      {resourcePdfs && resourcePdfs.length > 0 && (
                        <p className="mt-1 text-xs text-gray-500">✔ Uploaded</p>
                      )}
                    </div>

                    <div className="w-[210px] text-center relative">
                      {resourcePdfs.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {resourcePdfs.map((fileUrl, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-[#e9e9e9] p-2 rounded-md text-sm w-full md:w-auto"
                            >
                              <span className="truncate text-[#5C5C5C] max-w-[150px]">
                                Resource Pdf {index + 1}
                              </span>
                              <button
                                onClick={() => removePdf(index)}
                                className="ml-2 text-[20px] text-[#5C5C5C] hover:text-red-700"
                              >
                                x
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* {files.length > 0 && (
              <div className="mt-4 flex-1 overflow-y-auto">
                <FileList files={files} />
              </div>
            )} */}
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200">
                <div className="flex justify-end">
                  <button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className={`px-4 py-2 rounded-md text-white ${
                      canProceed
                        ? "bg-[#3B82F6] hover:bg-blue-600"
                        : "bg-gray-300 cursor-not-allowed"
                    } transition-colors`}
                  >
                    Proceed
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourceUploadModal;
